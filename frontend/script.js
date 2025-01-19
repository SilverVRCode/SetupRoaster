// Function to simulate submitting the setup to the API for roasting
function submitSetup() {
    const imageInput = document.getElementById('imageInput');
    const responseDiv = document.getElementById('response');
    const roastResult = document.getElementById('roastResult');

    if (!imageInput.files.length) {
      alert('Please upload an image of your setup!');
      return;
    }

    const file = imageInput.files[0];
    const reader = new FileReader();

    // Convert the image file to a Base64 string
    reader.onload = function (e) {
      const base64Image = e.target.result.split(',')[1]; // Remove the 'data:image/*;base64,' prefix

      // Make the API call to submit the Base64 image to the roasting API
      fetch('http://148.113.44.174:3000/processImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imgData: base64Image }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Extract and display only the 'text' part of the response JSON
          roastResult.textContent = data?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No roast generated.';
          responseDiv.style.display = 'block';
        })
        .catch((error) => {
          console.error('Error:', error);
          roastResult.textContent = 'Something went wrong, please try again!';
          responseDiv.style.display = 'block';
        });
    };

    reader.readAsDataURL(file); // Read the image file as a Base64 data URL
  }

    // Function to open the camera and take a picture
    function openCamera() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'camera';  // Use the device camera
      input.click();

      // When the user selects a file from the camera
      input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            // Display the captured image preview
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';

            // Automatically upload the captured image by copying it to the original file input
            imageInput.files = event.target.files;  // Manually assign the file to the file input
          };
          reader.readAsDataURL(file); // Read the image as a data URL
        }
      });
}