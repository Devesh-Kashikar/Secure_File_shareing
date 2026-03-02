const dropZone = document.querySelector(".drop-zone");
const fileInput = document.getElementById("chooseFile");
const browseBtn = document.querySelector(".browseBtn");

// Browse button clicked
browseBtn.addEventListener("click", () => {
    fileInput.click();
});

// User selected file
fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        uploadFile(e.target.files[0]);
    }
});

// Drag over
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragged");
});

// Drag leave
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
});

// File dropped
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");

    if (e.dataTransfer.files.length > 0) {
        uploadFile(e.dataTransfer.files[0]);
    }
});

// Firebase Upload
// function uploadFile(file) {
//     const storageRef = storage.ref("uploads/" + file.name);
//     const uploadTask = storageRef.put(file);

//     uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//             let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log("Upload: " + progress.toFixed(0) + "%");
//         },
//         (error) => {
//             alert("Upload failed: " + error.message);
//         },
//         () => {
//             uploadTask.snapshot.ref.getDownloadURL().then((url) => {
//                 alert("Uploaded!\nDownload Link:\n" + url);
//                 console.log("File URL:", url);
//             });
//         }
//     );
// }

function uploadFile(file) {

    // Show progress bar
    document.getElementById("progressArea").style.display = "flex";

    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    const storageRef = storage.ref("uploads/" + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress = Math.floor(progress);
            //console.log(snapshot);

            // Update progress bar
            progressFill.style.width = progress + "%";
            progressText.textContent = progress + "%";
        },
        (error) => {
            alert("Upload failed: " + error.message);
        },


        
        // () => {
        //     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        //         progressText.textContent = "Upload Complete!";
        //         console.log("File URL:", downloadURL);
        //         alert("File uploaded successfully!\nDownload link:\n" + downloadURL);
        //     });
        // }


        () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {

        // Changes
        showFilePreview(file, downloadURL);

        progressText.textContent = "Upload Complete!";
        console.log("File URL:", downloadURL);
         alert("File uploaded successfully!\nDownload link:\n" + downloadURL);
    });
}
    );
}



// new

function showFilePreview(file, downloadURL) {

    document.getElementById("filePreview").style.display = "flex";
    document.getElementById("fileName").textContent = file.name;

    let sizeInKB = (file.size / 1024).toFixed(2);
    document.getElementById("fileSize").textContent = sizeInKB + " KB";

    document.getElementById("downloadLink").href = downloadURL;

    const imageThumb = document.getElementById("imageThumb");
    const fileIcon = document.getElementById("fileIcon");

    // Check if file is an image
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = function(e) {
            imageThumb.src = e.target.result;
            imageThumb.style.display = "block";
            fileIcon.style.display = "none";   // hide file icon
        };

        reader.readAsDataURL(file);

    } else {
        // Not an image → show the file icon
        imageThumb.style.display = "none";
        fileIcon.style.display = "block";
    }
}


// uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//     showFilePreview(file, downloadURL);
// });
