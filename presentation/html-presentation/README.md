# Master Slides Container System

A VoxDeck.ai-inspired presentation system that allows for isolated slide editing and seamless navigation between slides.

## Features

- **Isolated Slide Editing**: Each slide is a separate HTML file, preventing style bleeding and conflicts
- **Master Container**: Central presentation controller that loads slides dynamically
- **Navigation Controls**: Keyboard shortcuts, navigation buttons, and slide dots
- **Progress Tracking**: Visual progress bar and slide indicators
- **Slide Notes**: Configurable slide descriptions and duration information
- **Fullscreen Support**: F11 or 'f' key for fullscreen presentation
- **Configuration-Driven**: Easy slide management through `slides-config.js`

## Quick Start

1. **Open the presentation**: Open `master-slides.html` in your browser
2. **Navigate slides**: Use arrow keys, space bar, or navigation buttons
3. **Edit slides**: Press Ctrl/Cmd+E to open current slide for editing
4. **Toggle notes**: Press 'N' to show/hide slide notes

## File Structure

```
presentation/html-presentation/
├── master-slides.html          # Main presentation controller
├── slides-config.js           # Slide configuration and metadata
├── slide-generator.html       # Tool for creating new slides
├── slide-template.html        # Template for new slides
├── page1.html                 # Individual slide files
├── page2.html
├── ...
└── README.md                  # This file
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `Home` | Go to first slide |
| `End` | Go to last slide |
| `F11` / `f` | Toggle fullscreen |
| `n` | Toggle slide notes |
| `Ctrl/Cmd + E` | Open current slide for editing |

## Configuration

Edit `slides-config.js` to manage your slides:

```javascript
const SLIDES_CONFIG = {
    totalSlides: 8,
    slideData: [
        {
            id: 1,
            filename: 'page1.html',
            title: 'Your Slide Title',
            description: 'Slide description',
            duration: 60,
            tags: ['intro', 'title']
        },
        // ... more slides
    ],
    // ... other configuration
};
```

## Creating New Slides

### Method 1: Using the Slide Generator
1. Open `slide-generator.html` in your browser
2. Fill in the slide details
3. Click "Generate Slide" to download the HTML file
4. Update `slides-config.js` with the new slide information

### Method 2: Manual Creation
1. Copy `slide-template.html` to `pageX.html` (where X is your slide number)
2. Edit the content as needed
3. Add the slide configuration to `slides-config.js`

## Slide Layouts

The system supports multiple layout types:

- **Single Column**: Centered content with key points
- **Two Column**: Split layout for comparisons or detailed content
- **Title Slide**: Large title with subtitle and branding
- **Code Slide**: Optimized for code examples and technical content

## Customization

### Styling
- Edit the CSS in `master-slides.html` to change the navigation appearance
- Modify individual slide files for slide-specific styling
- Update `slides-config.js` styling section for global theme changes

### Navigation
- Customize navigation behavior in the `SlideMaster` class
- Add new keyboard shortcuts in the `setupKeyboardNavigation()` method
- Modify the progress bar and slide indicators as needed

## Best Practices

1. **Keep slides isolated**: Each slide should be self-contained with its own styles
2. **Use consistent naming**: Follow the `pageX.html` naming convention
3. **Update configuration**: Always update `slides-config.js` when adding/removing slides
4. **Test navigation**: Verify all slides load correctly in the master container
5. **Optimize for presentation**: Use appropriate font sizes and contrast for projection

## Troubleshooting

### Slide not loading
- Check that the filename in `slides-config.js` matches the actual file
- Verify the slide HTML is valid and complete
- Check browser console for errors

### Navigation issues
- Ensure `totalSlides` in config matches actual number of slides
- Verify slide numbering is sequential
- Check that all slide files exist

### Styling conflicts
- Keep slide-specific styles within each slide file
- Use CSS isolation techniques if needed
- Test slides both individually and in the master container

## Advanced Features

### Auto-advance
Enable automatic slide advancement by setting `autoAdvance: true` in the navigation config.

### Timer
Show presentation timer by setting `showTimer: true` in the navigation config.

### Custom themes
Modify the styling section in `slides-config.js` to create custom themes.

## Contributing

When adding new features:
1. Maintain backward compatibility with existing slides
2. Update this README with new functionality
3. Test with all existing slides
4. Consider adding configuration options for new features

## License

This presentation system is part of "The Pollinator: Growth of NestJS Architecture" presentation for the International JavaScript Conference NYC 2025.
