#!/bin/bash

# Create directories
mkdir -p public/toys
mkdir -p public/icons

# Download toy images
curl -o public/toys/teddy.png "https://example.com/toy-images/teddy.png"
curl -o public/toys/blocks.png "https://example.com/toy-images/blocks.png"
curl -o public/toys/car.png "https://example.com/toy-images/car.png"
curl -o public/toys/robot.png "https://example.com/toy-images/robot.png"

# Download icon images
curl -o public/icons/choose.svg "https://example.com/icons/choose.svg"
curl -o public/icons/flexibility.svg "https://example.com/icons/flexibility.svg"
curl -o public/icons/swap.svg "https://example.com/icons/swap.svg"
curl -o public/icons/keep.svg "https://example.com/icons/keep.svg"

# Make script executable
chmod +x setup-assets.sh
