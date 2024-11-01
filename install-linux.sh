#!/bin/bash

# Update package index
sudo apt update

# Install Node.js and npm (Node Version Manager is recommended)
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (you can adjust this if you want a different version or method)
sudo apt install -y mongodb

# Install Git
sudo apt install -y git

# Clone the repository (replace <repository-url> with your actual URL)
git clone <repository-url> BinBuddy

# Change into the project directory
cd BinBuddy

# Install project dependencies
npm install

echo "Installation complete. You can now run your application."
