# Figma Capture

Capture an HTML mockup to Figma using the MCP HTML-to-Design workflow.

## Instructions

1. If $ARGUMENTS specifies a mockup file, use that. Otherwise, list HTML files in `figma-cli/mockups/` and ask the user which one to capture.
2. Verify the HTML file exists and references:
   - `design-system.css` stylesheet
   - `https://mcp.figma.com/mcp/html-to-design/capture.js` script
3. Start a local HTTP server to serve the mockups directory:
   ```bash
   cd figma-cli/mockups && python3 -m http.server 8321 &
   ```
4. Call `generate_figma_design` without `outputMode` to get capture options.
5. Present the output mode options to the user (newFile, existingFile, clipboard).
6. Call `generate_figma_design` with the selected output mode to get a `captureId`.
7. Open the capture URL in the browser for the user.
8. Poll `generate_figma_design` with the `captureId` every 5 seconds (up to 10 times) until status is `completed`.
9. Return the Figma file URL to the user.
10. Stop the local HTTP server.

## Notes
- Each capture ID is single-use — one page per capture.
- For multiple pages, call the tool once per page.
- The user must have the Figma MCP server configured and authenticated.
