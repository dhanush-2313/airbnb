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