<script>
(function(document){
  'use strict';
  var root = document.getElementById('tprx-root');
  if (!root) return;
  function q(id){ return document.getElementById(id); }

  var textField   = q('tprx-text');
  var countInput  = q('tprx-count');
  var customSep   = q('tprx-custom-sep');
  var metaEl      = q('tprx-meta');
  var toast       = q('tprx-toast');
  var toastMsg    = q('tprx-toast-msg');
  var btnRepeat   = q('tprx-btn-repeat');
  var btnUndo     = q('tprx-btn-undo');
  var btnCopy     = q('tprx-btn-copy');
  var btnClear    = q('tprx-btn-clear');
  var toggleLines = q('tprx-toggle-lines');
  var toggleNL    = q('tprx-toggle-newline');

  var originalValue = null, toastTimer = null;
  var SEP_MAP = {'none':'','space':' ','comma':',','comma-space':', ','newline':'\n','pipe':' | ','dash':' — ','custom':null};

  function getSep(){
    var checked = root.querySelector('.tprx-sep-radio:checked');
    var key = checked ? checked.value : 'none';
    return key === 'custom' ? customSep.value : (SEP_MAP[key] !== undefined ? SEP_MAP[key] : '');
  }

  function updateMeta(){
    var text = textField.value;
    var chars = text.length;
    var words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    metaEl.innerHTML = '<span>'+chars.toLocaleString()+'</span> chars &nbsp;·&nbsp; <span>'+words.toLocaleString()+'</span> words';
  }

  function markOriginal(){
    if(originalValue === null && textField.value){
      originalValue = textField.value;
      btnUndo.disabled = false;
    }
  }

  function repeatText(){
    var text = textField.value;
    if(!countInput.checkValidity()){ countInput.focus(); return; }
    if(!text){ return; }
    markOriginal();
    var count = parseInt(countInput.value, 10);
    var sep = getSep(), trailNL = toggleNL.checked ? '\n' : '', result = '';
    if(toggleLines.checked){
      result = text.split('\n').map(function(l){ var a=[]; for(var i=0;i<count;i++) a.push(l); return a.join(sep)+trailNL; }).join('\n');
    } else {
      var a = []; for(var i=0;i<count;i++) a.push(text);
      result = a.join(sep) + trailNL;
    }
    textField.value = result;
    updateMeta();
  }

  function undo(){
    if(originalValue === null) return;
    textField.value = originalValue;
    updateMeta();
  }

  function copyText(){
    if(!textField.value) return;
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(textField.value).then(showToast, fallbackCopy);
    } else { fallbackCopy(); }
  }

  function fallbackCopy(){
    textField.select();
    try{ document.execCommand('copy'); showToast(); } catch(e){ showToast('Could not copy. Please copy manually.'); }
  }

  function showToast(msg){
    toastMsg.textContent = msg || 'Copied to clipboard!';
    toast.classList.add('tprx-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.classList.remove('tprx-show'); }, 2400);
  }

  function clearAll(){
    textField.value = '';
    countInput.value = '3';
    customSep.value = '';
    toast.classList.remove('tprx-show');
    originalValue = null;
    btnUndo.disabled = true;
    updateMeta();
    textField.focus();
  }

  btnRepeat.addEventListener('click', repeatText);
  btnUndo.addEventListener('click', undo);
  btnCopy.addEventListener('click', copyText);
  btnClear.addEventListener('click', clearAll);
  textField.addEventListener('input', function(){ markOriginal(); updateMeta(); });
  countInput.addEventListener('keydown', function(e){ if(e.key==='Enter') repeatText(); });
  textField.addEventListener('keydown', function(e){ if(e.key==='Enter' && e.ctrlKey) repeatText(); });

  updateMeta();

}(document));
</script>
