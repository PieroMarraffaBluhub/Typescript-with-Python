# O2Ring Desktop Application

A desktop application for monitoring and displaying data from O2Ring pulse oximeter devices. Built with Electron, React, and Python.

## Project Structure
```
TestTypePython/
├── src/
│   ├── python/           # Python backend
│   │   ├── o2ring.py     # Main Python script for O2Ring communication
│   │   └── o2r/          # O2Ring library
│   ├── electron/         # Electron main process
│   │   ├── main.ts       # Main process code
│   │   ├── preload.ts    # Preload script
│   │   └── tsconfig.json # TypeScript config
│   ├── App.tsx           # React frontend
│   └── main.tsx          # React entry point
```

## Features
- Real-time monitoring of O2Ring data
- Display of oxygen levels and heart rate
- Motion and battery level monitoring
- Raw data output display
- Easy start/stop monitoring controls

## Prerequisites
- Node.js and npm
- Python 3
- Electron
- TypeScript
- React

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd TestTypePython
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Development

### Running the Application
Start the development server:
```bash
npm run dev
```

This will:
- Start the Vite dev server
- Launch the Electron app
- Connect to the O2Ring device

### Building for Production
Create production build:
```bash
npm run build
```

Package the application:
```bash
npm run package
```

## Architecture Overview

### Data Flow
1. O2Ring device → Python script
2. Python script → Electron main process
3. Electron main process → React frontend

### Key Components

#### Python Backend (`o2ring.py`)
- Handles BLE (Bluetooth Low Energy) communication
- Device discovery and connection
- Data streaming and processing
- Device configuration

#### Electron Main Process (`main.ts`)
- Manages desktop application window
- Handles Python process spawning
- Implements IPC communication

#### React Frontend (`App.tsx`)
- User interface for monitoring
- Real-time data display
- Raw output visualization

## IPC Communication
- `start-o2ring`: Starts the Python process
- `stop-o2ring`: Stops the Python process
- `o2ring-data`: Streams data from Python to frontend

## Displayed Data
- Oxygen level (%)
- Heart rate (BPM)
- Heart rate strength
- Motion data
- Battery level
- Raw output

## Testing

### Frontend Testing
```bash
npm run test
```

### Python Testing
```bash
python -m pytest
```

## Troubleshooting

### Common Issues

1. Python process not starting
   - Check Python path
   - Verify dependencies
   - Check permissions

2. BLE connection issues
   - Verify device is in range
   - Check Bluetooth permissions
   - Restart the application

3. Data display issues
   - Check IPC communication
   - Verify data format
   - Check React state management

## Best Practices

### Error Handling
- Implement proper error handling in Python script
- Use try-catch blocks in Electron main process
- Handle disconnections gracefully

### Performance
- Use efficient data structures
- Implement proper cleanup on app exit
- Handle memory management carefully

### Security
- Keep sensitive data secure
- Validate all inputs
- Use proper error messages

## Future Enhancements

### Planned Improvements
1. Data logging and export
2. Advanced data visualization
3. Multiple device support
4. Custom alerts and notifications
5. Offline data storage
6. User preferences management

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
[Add your license information here]

## Contact
[Add your contact information here]
