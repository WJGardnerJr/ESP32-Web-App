let currentPhotoIndex = 0; // Start with the first photo in the array
let photoNames = []; // Array to store the names of the photos

function refresh() {
  if (photoNames.length === 0) return; // Exit if no photos

  let filename = photoNames[currentPhotoIndex]; // Get the file name from the array
  let photoRef = storageRef.child(`data/${filename}`);

  photoRef.getDownloadURL().then(url => {
    document.getElementById('img').src = url;
    document.getElementById('filename').textContent = filename;
    photoRef.getMetadata().then(metadata => {
      document.getElementById('date-time').textContent = new Date(metadata.timeCreated).toLocaleString();
      document.getElementById('photo-index').textContent = `Photo ${currentPhotoIndex + 1} of ${photoNames.length}`;
    });
  }).catch(error => {
    console.log('Error loading photo:', error);
  });
  window.location.reload();
}
function clearFirestore() {
    // Display confirmation dialog
    if (confirm("Are you sure you want to clear Firestore? This action cannot be undone.")) {
      var storageRef = firebase.storage().ref();
      storageRef.listAll().then(result => {
          if (result.items.length > 0) {
              let deletePromises = [];
              result.items.forEach(itemRef => {
                  // Add the delete promise to an array
                  deletePromises.push(itemRef.delete());
              });
  
              // Wait for all files to be deleted
              Promise.all(deletePromises).then(() => {
                  console.log('All files deleted');
                  window.location.reload(); // Reload the page after deleting the files
              }).catch(error => {
                  console.error("Error deleting files: ", error);
              });
          } else {
              console.log('No files to delete in Storage');
          }
      }).catch(error => {
          console.error("Error listing files in Storage: ", error);
      });
  }
}

function deleteFile(directoryRef, fileName) {
    const fileRef = directoryRef.child(fileName);
    fileRef.delete().then(() => {
        console.log(`File ${fileName} deleted successfully`);
    }).catch((error) => {
        console.log(`Error deleting file ${fileName}:`, error);
    });
}

function updatePhotoList() {
  // Get the list of photo names from the storage
  storageRef.child('data').listAll().then(result => {
    photoNames = result.items.map(item => item.name); // Store the file names in the array
    totalPhotos = photoNames.length;
    if (photoNames.length > 0) {
      refresh(); // Refresh to display the first photo
    }
  });
}

document.getElementById('next').addEventListener('click', () => {
  if (currentPhotoIndex < photoNames.length - 1) {
    currentPhotoIndex++;
    refresh();
  }
});

document.getElementById('previous').addEventListener('click', () => {
  if (currentPhotoIndex > 0) {
    currentPhotoIndex--;
    refresh();
  }
});

// Initialize
updatePhotoList();
