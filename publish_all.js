async (page, videoData) => {
  const results = [];

  for (const item of videoData) {
    try {
      // === PHASE 1: Navigate and Upload ===
      await page.goto('https://creatorosai.lovable.app/publisher');
      await page.waitForTimeout(1000);
      
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('text=Arraste mídias aqui').click(),
      ]);
      await fileChooser.setFiles([`G:\\Open Squad\\.playwright-mcp\\${item.filename}`]);
      await page.waitForTimeout(1000);

      // === PHASE 2: Select platforms and format ===
      await page.locator('button:has-text("Instagram")').first().click();
      await page.waitForTimeout(200);
      await page.locator('button:has-text("YouTube Shorts")').first().click();
      await page.waitForTimeout(200);
      await page.locator('button:has-text("Reels")').click();
      await page.waitForTimeout(200);

      // === PHASE 3: Fill main fields ===
      await page.getByPlaceholder('Ex: Carrossel sobre Hábitos').fill(item.internal_title);
      await page.getByPlaceholder('Título que aparecerá no Instagram').fill(item.instagram_title);
      await page.getByPlaceholder('Escreva a legenda principal...').fill(item.main_caption);
      await page.getByPlaceholder('#hashtags').fill(item.hashtags.join(' '));
      await page.getByPlaceholder('Call to action').fill(item.cta);
      
      // === PHASE 4: Fill YouTube per-platform fields ===
      const ytHeading = page.locator('h3:has-text("YouTube Shorts")');
      if (await ytHeading.count() > 0) {
        await ytHeading.locator('button').click();
        await page.waitForTimeout(300);
      }
      const ytTitleField = page.getByPlaceholder('Título para YouTube');
      if (await ytTitleField.count() > 0) {
        await ytTitleField.fill(item.youtube_title);
      }
      const ytDescField = page.getByPlaceholder('Descrição para YouTube');
      if (await ytDescField.count() > 0) {
        await ytDescField.fill(item.youtube_description);
      }
      
      // === PHASE 5: Fill Instagram per-platform fields ===
      const igHeading = page.locator('h3:has-text("Instagram")');
      if (await igHeading.count() > 0) {
        await igHeading.locator('button').click();
        await page.waitForTimeout(200);
      }
      const igCaptionField = page.getByPlaceholder('Legenda específica para Instagram');
      if (await igCaptionField.count() > 0) {
        await igCaptionField.fill(item.instagram_caption);
      }

      // === PHASE 6: Auto comment ===
      const switches = page.locator('[role="switch"]');
      const switchCount = await switches.count();
      if (switchCount > 0) {
        await switches.first().click();
        await page.waitForTimeout(200);
      }
      await page.locator('button:has-text("5 min")').click();
      await page.waitForTimeout(200);

      // === PHASE 7: Approval and Schedule ===
      if (switchCount > 1) {
        await switches.nth(1).click();
        await page.waitForTimeout(200);
      }
      await page.locator('button:has-text("Aplicar próximo horário")').click();
      await page.waitForTimeout(500);
      await page.locator('button:has-text("Agendar")').click();
      await page.waitForTimeout(1000);

      results.push({ filename: item.filename, status: 'SUCCESS' });
    } catch (err) {
      results.push({ filename: item.filename, status: 'FAILED', error: err.message.substring(0, 200) });
    }
  }

  return JSON.stringify(results, null, 2);
}