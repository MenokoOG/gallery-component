import fs from 'fs';
import path from 'path';

// Function to get all image files recursively
const getAllImages = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllImages(path.join(dirPath, file), arrayOfFiles);
    } else if (file.endsWith('.jpg') || file.endsWith('.png')) {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
};

// Define the path to the images folder and the output file
const imagesFolderPath = path.join(process.cwd(), 'src/assets/images');
const outputFilePath = path.join(process.cwd(), 'src/data/imageData.js');

// Get all image files
const imageFiles = getAllImages(imagesFolderPath);

// Generate the import statements and image data array
let importStatements = '';
let imageArray = 'const images = [\n';

imageFiles.forEach((file, index) => {
  const variableName = `img${index + 1}`;
  const relativePath = file.replace(process.cwd(), '').replace(/\\/g, '/');
  importStatements += `import ${variableName} from '${relativePath}';\n`;
  imageArray += `  ${variableName},\n`;
});

imageArray += '];\n\nexport default images;';

// Combine the import statements and image array into the final file content
const fileContent = `${importStatements}\n${imageArray}`;

// Write the content to the output file
fs.writeFile(outputFilePath, fileContent, err => {
  if (err) {
    console.error('Error writing the image data file:', err);
    return;
  }

  console.log('Image data file generated successfully.');
});
