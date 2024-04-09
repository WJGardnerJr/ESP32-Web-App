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
        const collectionRef = firestore.collection('yourCollectionName');
        collectionRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                collectionRef.doc(doc.id).delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
        }).catch((error) => {
            console.error("Error getting documents: ", error);
        });
    window.location.reload();
    } else {
        // User clicked "No", do nothing
        console.log("Clear action canceled by user.");
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
