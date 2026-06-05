# Contributing to Balsm.IO Documentation

Thank you for your interest in improving Balsm.IO documentation! This guide will help you contribute effectively.

## How to Contribute

### Reporting Issues

If you find errors, outdated information, or missing documentation:

1. Check if an issue already exists
2. Create a new issue with:
   - Clear description of the problem
   - Location (file path and section)
   - Suggested improvement (if applicable)

### Submitting Changes

1. **Fork the repository**
   ```bash
   gh repo fork Balsm-IO/docs --clone
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b docs/your-improvement
   ```

3. **Make your changes**
   - Follow the writing style guide below
   - Test all code examples
   - Check for broken links

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "docs: describe your changes"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin docs/your-improvement
   gh pr create --fill
   ```

## Documentation Standards

### Writing Style

- **Clear and concise**: Use simple language
- **Active voice**: "Click the button" not "The button should be clicked"
- **Present tense**: "The system returns" not "The system will return"
- **Second person**: Address the reader as "you"

### Markdown Guidelines

- Use ATX-style headers (`#` not underlines)
- Include a blank line before and after headers, lists, and code blocks
- Use fenced code blocks with language specifiers
- Keep lines under 120 characters when possible

### Code Examples

```markdown
\`\`\`language
// Always include:
// 1. Complete, runnable examples
// 2. Comments explaining key concepts
// 3. Error handling where appropriate
\`\`\`
```

### Structure

Each documentation page should include:

1. **Title** (H1)
2. **Overview** - Brief description
3. **Prerequisites** (if applicable)
4. **Main content** - Organized with H2/H3 headers
5. **Related links** - Links to related documentation

## Documentation Categories

### API Documentation
- Include request/response examples
- Document all parameters and their types
- Show error cases
- Include authentication requirements

### User Guides
- Step-by-step instructions
- Screenshots where helpful (in `/assets/images/`)
- Common pitfalls and solutions
- Cross-reference related features

### Developer Documentation
- Architecture diagrams
- Setup instructions
- Code examples in multiple languages
- Best practices

### Clinical Workflows
- Regulatory context
- Clinical rationale
- Safety considerations
- Compliance requirements

## Review Process

1. **Automated checks**: Linters and link checkers run on PRs
2. **Peer review**: At least one reviewer must approve
3. **Technical review**: Subject matter expert review for technical/clinical content
4. **Compliance review**: Required for clinical and regulatory documentation

## File Organization

```
docs/
├── api/              # API documentation
├── guides/           # User guides
├── developers/       # Developer docs
├── clinical/         # Clinical workflows
├── assets/           # Images, diagrams, downloads
└── templates/        # Documentation templates
```

## Tools and Resources

### Helpful Tools
- [Markdown Preview](https://markdownlivepreview.com/)
- [Vale](https://vale.sh/) - Linter for prose
- [doctoc](https://github.com/thlorenz/doctoc) - Table of contents generator

### Style Guides
- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/)

## Questions?

- Create a [GitHub Discussion](https://github.com/Balsm-IO/docs/discussions)
- Email: docs@balsm.io
- Developer Discord: https://discord.gg/balsm-dev

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
