import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * GET /api/get-templates
 * Returns all MPG template metadata for the template gallery
 * Query params:
 * - includeHidden=true - Include hidden templates (for admin use)
 * - includeJsonData=true - Include full JSON data (for template generator)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';
    const includeJsonData = searchParams.get('includeJsonData') === 'true';

    // Check both template directories
    const templateDirectories = [
      path.join(process.cwd(), 'public/mpg/templates/json'),
      path.join(process.cwd(), 'public/templates/json'),
    ];

    const allTemplates = [];

    for (const templatesDirectory of templateDirectories) {
      try {
        // Check if directory exists
        await fs.access(templatesDirectory);

        // Read all JSON files from the templates directory
        const files = await fs.readdir(templatesDirectory);
        const templateFiles = files.filter(file => file.endsWith('.json'));

        // Load each template file
        const templates = await Promise.all(
          templateFiles.map(async (filename) => {
            const filePath = path.join(templatesDirectory, filename);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const templateData = JSON.parse(fileContent);

            // Extract metadata
            const template: any = {
              id: templateData.id,
              name: templateData.name,
              description: templateData.description || `Beautiful map poster of ${templateData.city}`,
              city: templateData.city,
              style: templateData.style,
              featured: templateData.featured || false,
              popular: templateData.popular || false,
              hidden: templateData.hidden || false,
              tags: templateData.tags || [templateData.style, templateData.city],
              thumbnail: templateData.thumbnail || `/mpg/template-previews/${templateData.id}.jpg`
            };

            // Include full JSON data if requested (for template generator)
            if (includeJsonData) {
              template.jsonData = templateData.jsonData;
            }

            return template;
          })
        );

        allTemplates.push(...templates);
      } catch (error) {
        // Directory doesn't exist or can't be accessed - skip it
        console.log(`Directory ${templatesDirectory} not accessible, skipping...`);
      }
    }

    // Remove duplicates (prefer templates from /templates/json over /mpg/templates/json)
    const uniqueTemplates = Array.from(
      new Map(allTemplates.map(t => [t.id, t])).values()
    );

    // Filter out hidden templates unless includeHidden is true
    let finalTemplates = includeHidden
      ? uniqueTemplates
      : uniqueTemplates.filter(t => !t.hidden);

    // Sort by featured/popular, then alphabetical
    finalTemplates = finalTemplates.sort((a, b) => {
      // Featured templates first, then popular, then alphabetical
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      templates: finalTemplates,
      count: finalTemplates.length
    });

  } catch (error: any) {
    console.error('Error loading templates:', error);
    return NextResponse.json(
      {
        error: 'Failed to load templates',
        message: error.message,
        templates: []
      },
      { status: 500 }
    );
  }
}
