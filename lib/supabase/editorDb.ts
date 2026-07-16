"use server";

import { getAdminClient } from "./admin";

export async function loadProjectData(slugOrId: string) {
  const supabase = getAdminClient();
  if (!supabase) {
    console.warn("Supabase credentials missing. Operating in Mock Mode.");
    return null;
  }

  try {
    // 1. Fetch project
    let query = supabase.from("projects").select("*");
    
    // Check if it's UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    if (isUuid) {
      query = query.eq("id", slugOrId);
    } else {
      query = query.eq("slug", slugOrId);
    }

    const { data: project, error: projError } = await query.single();
    if (projError || !project) {
      console.error("Project not found in database:", slugOrId);
      return null;
    }

    // 2. Fetch theme
    const { data: themeData } = await supabase
      .from("themes")
      .select("*")
      .eq("project_id", project.id)
      .single();

    // 3. Fetch pages
    const { data: dbPages, error: pagesError } = await supabase
      .from("pages")
      .select("*")
      .eq("project_id", project.id)
      .order("order_index", { ascending: true });

    if (pagesError) {
      console.error("Failed to load pages:", pagesError);
      return null;
    }

    const pages = [];
    for (const page of dbPages) {
      // 4. Fetch sections for this page
      const { data: dbSections } = await supabase
        .from("sections")
        .select("*")
        .eq("page_id", page.id)
        .order("order_index", { ascending: true });

      const pageBlocks = [];
      if (dbSections && dbSections.length > 0) {
        // Fetch blocks for each section (typically 1 default section in our editor)
        for (const section of dbSections) {
          const { data: dbBlocks } = await supabase
            .from("blocks")
            .select("*")
            .eq("section_id", section.id)
            .order("order_index", { ascending: true });

          if (dbBlocks) {
            for (const b of dbBlocks) {
              pageBlocks.push({
                id: b.id,
                type: b.type,
                properties: b.properties || {},
                styles: b.styles || {},
                animation: b.animation || {},
              });
            }
          }
        }
      }

      pages.push({
        id: page.id,
        title: page.title,
        heading: page.heading || "",
        subheading: page.subheading || "",
        quote: page.quote || "",
        buttonText: page.button_text || "",
        footerText: page.footer_text || "",
        blocks: pageBlocks,
      });
    }

    // Parse theme colors or default them
    const themeColors = themeData?.colors || {};
    const parsedTheme = {
      themeName: themeColors.themeName || "Birthday Theme",
      primaryColor: themeColors.primaryColor || "#FFD1DC",
      secondaryColor: themeColors.secondaryColor || "#E8DEF8",
      backgroundColor: themeColors.backgroundColor || "#FFF8F8",
      foregroundColor: themeColors.foregroundColor || "#4A3B32",
      radius: themeColors.radius || "24px",
      shadows: themeColors.shadows || "md",
      cursor: themeColors.cursor || "sparkle",
      loader: themeColors.loader || "cake",
      fontHeading: themeColors.fontHeading || "Poppins",
      fontBody: themeColors.fontBody || "Nunito",
      fontHandwriting: themeColors.fontHandwriting || "Caveat",
      backgroundAnimation: themeColors.backgroundAnimation || "balloons",
      stickers: themeColors.stickers || ["🎈", "🎂", "🎉", "🎁"],
      icons: themeColors.icons || "outline",
      balloonsEnabled: themeColors.balloonsEnabled !== undefined ? themeColors.balloonsEnabled : true,
      confettiEnabled: themeColors.confettiEnabled !== undefined ? themeColors.confettiEnabled : true,
      fireworksEnabled: themeColors.fireworksEnabled !== undefined ? themeColors.fireworksEnabled : true,
      buttonStyle: themeColors.buttonStyle || "rounded",
      cardStyle: themeColors.cardStyle || "shadow",
      pageTransition: themeColors.pageTransition || "fade",
    };

    // Parse mascot config or default it
    const mascotConfig = project.mascot_config || {};
    const parsedMascot = {
      type: mascotConfig.type || "giraffe",
      customUrl: mascotConfig.customUrl || "",
      defaultPose: mascotConfig.defaultPose || "idle",
      animationStyle: mascotConfig.animationStyle || "floating",
      size: mascotConfig.size || 160,
      positionX: mascotConfig.positionX !== undefined ? mascotConfig.positionX : 50,
      positionY: mascotConfig.positionY !== undefined ? mascotConfig.positionY : 80,
      enableFloating: mascotConfig.enableFloating !== undefined ? mascotConfig.enableFloating : true,
      enableInteractions: mascotConfig.enableInteractions !== undefined ? mascotConfig.enableInteractions : true,
      enableBirthdayOutfit: mascotConfig.enableBirthdayOutfit !== undefined ? mascotConfig.enableBirthdayOutfit : true,
    };

    return {
      projectId: project.id,
      slug: project.slug || "",
      recipientName: project.recipient_name || "Recipient",
      countdownDate: project.countdown_date || new Date().toISOString(),
      bgMusicUrl: project.bg_music_url || "",
      passwords: project.passwords || {},
      occasion: project.occasion || "birthday",
      status: project.status || "draft",
      theme: parsedTheme,
      mascot: parsedMascot,
      pages,
    };
  } catch (error) {
    console.error("Failed loading project data:", error);
    return null;
  }
}

export async function saveProjectData(projectId: string, state: any) {
  const supabase = getAdminClient();
  if (!supabase) {
    return { success: true, message: "Mock Mode auto-saved successfully." };
  }

  try {
    // 1. Update project root fields
    const { error: projError } = await supabase
      .from("projects")
      .update({
        recipient_name: state.recipientName,
        countdown_date: state.countdownDate,
        bg_music_url: state.bgMusicUrl,
        passwords: state.passwords,
        status: state.status || "draft",
        occasion: state.occasion || "birthday",
        mascot_config: state.mascot,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (projError) throw projError;

    // 2. Update theme fields
    const { error: themeError } = await supabase
      .from("themes")
      .upsert({
        project_id: projectId,
        colors: state.theme,
        fonts: {
          heading: state.theme.fontHeading,
          body: state.theme.fontBody,
          handwriting: state.theme.fontHandwriting,
        },
        cursor: state.theme.cursor,
        loader_type: state.theme.loader,
        radius: state.theme.radius,
        shadows: state.theme.shadows,
      }, { onConflict: "project_id" });

    if (themeError) throw themeError;

    // 3. Sync pages, sections, and blocks
    // Fetch all current pages from the database for this project
    const { data: dbPages } = await supabase
      .from("pages")
      .select("id")
      .eq("project_id", projectId);

    const dbPageIds = dbPages ? dbPages.map((p) => p.id) : [];
    const statePageIds = state.pages.map((p: any) => p.id);

    // Delete pages that are in DB but no longer in editor state
    const pagesToDelete = dbPageIds.filter((id) => !statePageIds.includes(id));
    if (pagesToDelete.length > 0) {
      await supabase.from("pages").delete().in("id", pagesToDelete);
    }

    // Upsert remaining/new pages
    let pageIndex = 0;
    for (const page of state.pages) {
      const isNewPage = !page.id.startsWith("page-") || isNaN(Number(page.id.split("-")[1]));
      const pageUuid = isNewPage ? page.id : undefined; // if it starts with page-178... it's a temporary client ID, we let DB generate UUID

      // Derive a stable slug from the page title for the DB unique constraint
      const pageSlug = page.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `page-${pageIndex}`;

      const pagePayload = {
        project_id: projectId,
        slug: pageSlug,
        title: page.title,
        order_index: pageIndex++,
        heading: page.heading || "",
        subheading: page.subheading || "",
        quote: page.quote || "",
        button_text: page.buttonText || "",
        footer_text: page.footerText || "",
      };

      let pageRecord;
      if (pageUuid) {
        // Upsert by ID
        const { data } = await supabase
          .from("pages")
          .upsert({ id: pageUuid, ...pagePayload }, { onConflict: "id" })
          .select()
          .single();
        pageRecord = data;
      } else {
        // Upsert matching on project_id + slug
        const { data } = await supabase
          .from("pages")
          .upsert(pagePayload, { onConflict: "project_id,slug" })
          .select()
          .single();
        pageRecord = data;
      }

      if (!pageRecord) continue;

      // Ensure at least one section exists for this page
      const { data: sections } = await supabase
        .from("sections")
        .select("id")
        .eq("page_id", pageRecord.id);

      let sectionRecord;
      if (sections && sections.length > 0) {
        sectionRecord = sections[0];
      } else {
        const { data } = await supabase
          .from("sections")
          .insert({
            page_id: pageRecord.id,
            layout_type: "single-col",
            order_index: 0,
            styles: {},
          })
          .select()
          .single();
        sectionRecord = data;
      }

      if (!sectionRecord) continue;

      // Sync blocks for this section
      const { data: dbBlocks } = await supabase
        .from("blocks")
        .select("id")
        .eq("section_id", sectionRecord.id);

      const dbBlockIds = dbBlocks ? dbBlocks.map((b) => b.id) : [];
      const stateBlockIds = page.blocks.map((b: any) => b.id);

      // Delete blocks no longer in this page
      const blocksToDelete = dbBlockIds.filter((id) => !stateBlockIds.includes(id));
      if (blocksToDelete.length > 0) {
        await supabase.from("blocks").delete().in("id", blocksToDelete);
      }

      // Upsert blocks
      let blockIndex = 0;
      for (const block of page.blocks) {
        const isNewBlock = !block.id.startsWith("blk-") || isNaN(Number(block.id.split("-")[1]));
        const blockUuid = isNewBlock ? block.id : undefined;

        const blockPayload = {
          section_id: sectionRecord.id,
          type: block.type,
          properties: block.properties || {},
          styles: block.styles || {},
          animation: block.animation || {},
          order_index: blockIndex++,
        };

        if (blockUuid) {
          await supabase
            .from("blocks")
            .upsert({ id: blockUuid, ...blockPayload });
        } else {
          await supabase
            .from("blocks")
            .insert(blockPayload);
        }
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed saving project data:", error);
    return { success: false, error: error.message || error };
  }
}
