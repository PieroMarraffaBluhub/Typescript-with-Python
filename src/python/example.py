import sys
import json

def process_data(data):
    # Example Python function that processes data
    return {
        "message": f"Processed: {data}",
        "length": len(data)
    }

if __name__ == "__main__":
    # Get input from command line arguments
    if len(sys.argv) > 1:
        input_data = sys.argv[1]
        result = process_data(input_data)