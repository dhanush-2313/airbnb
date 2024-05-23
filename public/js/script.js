(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

document.querySelectorAll('.read-more').forEach(button => {
  const reviewText = button.previousElementSibling;
  const lineHeight = parseFloat(getComputedStyle(reviewText)['line-height']);
  const maxHeight = lineHeight * 3;

  reviewText.style.height = `${maxHeight}px`;
  reviewText.style.overflow = 'visible';

  if (reviewText.scrollHeight > maxHeight) {
    button.style.display = 'block';
  }

  reviewText.style.overflow = 'hidden';

  button.addEventListener('click', () => {
    if (reviewText.style.height !== 'auto') {
      reviewText.style.height = 'auto';
      button.textContent = 'Read Less';
    } else {
      reviewText.style.height = `${maxHeight}px`;
      button.textContent = 'Read More';
    }
  });
});

function checkFileSize(input) {
  // Get the selected file
  const file = input.files[0];

  // Check the file size
  if (file.size > 5 * 1024 * 1024) { // 5MB
      // If the file is too large, show an alert and clear the input field
      alert("File size limit exceeded. Please select a file smaller than 5MB.");
      input.value = "";
  }
}