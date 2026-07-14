const $ = window.jQuery;

export function initUpload() {
  const Dropzone = window.Dropzone;
  const $form = $('#clickFitDropzone');
  const $submit = $('#uploadSubmit');

  if (!Dropzone || !$form.length || !$submit.length) return;

  const uploader = new Dropzone('#clickFitDropzone', {
    url: '/api/upload',
    paramName: 'images',
    uploadMultiple: true,
    autoProcessQueue: false,
    parallelUploads: 6,
    maxFiles: 6,
    maxFilesize: 5,
    acceptedFiles: 'image/jpeg,image/png,image/webp,image/gif',
    addRemoveLinks: true,
    timeout: 30000
  });

  $submit.on('click', () => {
    if (!uploader.getQueuedFiles().length) {
      showUploadResult('error', 'Choose at least one image first.');
      return;
    }

    $submit.prop('disabled', true);
    showUploadResult('', 'Sending images...');
    uploader.processQueue();
  });

  uploader.on('successmultiple', (_files, response) => {
    showUploadResult('success', getResponseMessage(response));
  });

  uploader.on('errormultiple', (_files, response) => {
    showUploadResult('error', getResponseMessage(response));
  });

  uploader.on('error', (_file, response) => {
    showUploadResult('error', getResponseMessage(response));
  });

  uploader.on('queuecomplete', () => {
    $submit.prop('disabled', false);
  });
}

function showUploadResult(type, message) {
  $('#uploadResults')
    .removeClass('success error')
    .addClass(type)
    .text(message || 'Upload failed.');
}

function getResponseMessage(response) {
  if (typeof response === 'string') return response;
  if (response?.message) return response.message;

  if (response?.responseText) {
    try {
      return JSON.parse(response.responseText).message || response.responseText;
    } catch (_error) {
      return response.responseText;
    }
  }

  return 'Upload failed.';
}
