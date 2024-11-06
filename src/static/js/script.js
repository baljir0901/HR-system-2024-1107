class RecruitmentForm {
  constructor() {
      this.form = document.getElementById('recruitmentForm');
      this.modal = document.getElementById('reviewModal');
      this.confirmButton = document.getElementById('confirmSubmit');
      this.cancelButton = document.getElementById('cancelSubmit');
      
      this.setupEventListeners();
  }

  setupEventListeners() {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      this.confirmButton.addEventListener('click', () => this.submitForm());
      this.cancelButton.addEventListener('click', () => this.closeModal());
  }

  handleSubmit(e) {
      e.preventDefault();
      if (this.validateForm()) {
          this.showReviewModal();
      }
  }

  validateForm() {
      const requiredFields = this.form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
          if (!field.value.trim()) {
              isValid = false;
              this.showError(field);
          } else {
              this.clearError(field);
          }
      });

      return isValid;
  }

  showError(field) {
      field.classList.add('error');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = 'This field is required';
      
      // Remove existing error message if any
      this.clearError(field);
      
      field.parentElement.appendChild(errorDiv);
  }

  clearError(field) {
      field.classList.remove('error');
      const existingError = field.parentElement.querySelector('.error-message');
      if (existingError) {
          existingError.remove();
      }
  }

  showReviewModal() {
      const formData = new FormData(this.form);
      let reviewContent = '<div class="review-items">';
      
      formData.forEach((value, key) => {
          reviewContent += `
              <div class="review-item">
                  <strong>${key}:</strong> ${value}
              </div>
          `;
      });
      
      reviewContent += '</div>';
      document.getElementById('reviewContent').innerHTML = reviewContent;
      this.modal.style.display = 'block';
  }

  closeModal() {
      this.modal.style.display = 'none';
  }

  async submitForm() {
      try {
          const formData = new FormData(this.form);
          const response = await fetch('/submit', {
              method: 'POST',
              body: formData
          });

          const result = await response.json();
          
          if (result.status === 'success') {
              alert('Form submitted successfully!');
              this.form.reset();
              this.closeModal();
          } else {
              throw new Error(result.message || 'Submission failed');
          }
      } catch (error) {
          alert('Error submitting form: ' + error.message);
      }
  }
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new RecruitmentForm();
});