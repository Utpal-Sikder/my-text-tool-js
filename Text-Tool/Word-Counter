(function () {
  'use strict';

  if (window._wcReady) return;
  window._wcReady = true;

  var ta = document.getElementById('wc-textarea'),
    copyBtn = document.getElementById('wc-copy-btn'),
    clearBtn = document.getElementById('wc-clear-btn'),
    uploadBtn = document.getElementById('wc-upload-btn'),
    downloadBtn = document.getElementById('wc-download-btn'),
    pasteBtn = document.getElementById('wc-paste-btn'),
    toast = document.getElementById('wc-toast-msg'),
    sW = document.getElementById('stat-words'),
    sC = document.getElementById('stat-chars'),
    sCN = document.getElementById('stat-chars-ns'),
    sSe = document.getElementById('stat-sentences'),
    sPa = document.getElementById('stat-paragraphs'),
    sWPS = document.getElementById('stat-wps'),
    sLines = document.getElementById('stat-lines'),
    sRT = document.getElementById('stat-read-time'),
    sST = document.getElementById('stat-speak-time'),
    sRL = document.getElementById('stat-read-level');

  if (!ta || !sW) return;

  var prev = { words: 0, chars: 0, charsNS: 0, sents: 0, paras: 0, wps: 0, lines: 0 },
    tT = null,
    rId = null;

  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!word) return 0;
    var m = word.match(/[aeiouy]+/g);
    var c = m ? m.length : 1;
    if (word.endsWith('e') && c > 1) c--;
    return Math.max(1, c);
  }

  function analyze(t) {
    var trimmed = t.trim();
    var wordsArr = trimmed === '' ? [] : trimmed.split(/\s+/).filter(Boolean);
    var w = wordsArr.length;
    var c = t.length,
      cn = t.replace(/\s/g, '').length;

    var sentArr = trimmed === '' ? [] : (t.match(/[^.!?]*[.!?]+/g) || []).filter(function (x) {
      return x.trim().length > 0;
    });
    var s = sentArr.length;

    var pArr = trimmed === '' ? [] : trimmed.split(/\n\s*\n/).filter(function (p) {
      return p.trim().length > 0;
    });
    var p = trimmed === '' ? 0 : (pArr.length > 0 ? pArr.length : 1);
    var lineBreaks = t === '' ? 0 : (t.match(/\n/g) || []).length;
    var wps = s > 0 ? Math.round((w / s) * 10) / 10 : 0;
    var syll = 0;

    if (w > 0) {
      for (var i = 0; i < wordsArr.length; i++) {
        syll += countSyllables(wordsArr[i]);
      }
    }

    var fk = (w > 0 && s > 0) ? Math.max(0, Math.round((0.39 * (w / s) + 11.8 * (syll / w) - 15.59) * 10) / 10) : 0;
    var level = '–';
    var readWpm = 238,
      speakWpm = 130;

    if (w > 0) {
      if (fk < 6) {
        level = 'Easy';
        readWpm = 260;
        speakWpm = 140;
      } else if (fk < 9) {
        level = 'Standard';
        readWpm = 238;
        speakWpm = 130;
      } else if (fk < 13) {
        level = 'Difficult';
        readWpm = 200;
        speakWpm = 115;
      } else {
        level = 'Advanced';
        readWpm = 170;
        speakWpm = 100;
      }
    }

    return {
      words: w,
      chars: c,
      charsNS: cn,
      sents: s,
      paras: p,
      wps: wps,
      lines: lineBreaks,
      rS: Math.round((w / readWpm) * 60),
      spS: Math.round((w / speakWpm) * 60),
      level: level,
      readWpm: readWpm,
      speakWpm: speakWpm
    };
  }

  function fmt(s) {
    if (s <= 0) return '0s';
    if (s < 60) return s + 's';
    var m = Math.floor(s / 60),
      r = s % 60;
    return r > 0 ? m + 'm ' + r + 's' : m + 'm';
  }

  function bump(el) {
    el.classList.remove('wc-bump');
    void el.offsetWidth;
    el.classList.add('wc-bump');
    el.addEventListener('animationend', function h() {
      el.classList.remove('wc-bump');
      el.removeEventListener('animationend', h);
    });
  }

  function setVal(el, v, o) {
    var f = typeof v === 'number' ? v.toLocaleString() : v;
    if (el.textContent !== String(f)) {
      el.textContent = f;
      if (v !== o) bump(el);
    }
  }

  function updateSocial(chars, words) {
    var maxLimit = 0;

    document.querySelectorAll('.wc-social-node').forEach(function (node) {
      var limit = parseInt(node.getAttribute('data-limit'), 10);
      var unit = node.getAttribute('data-unit') || 'c';
      var val = unit === 'w' ? words : chars;
      if (unit !== 'w') maxLimit = Math.max(maxLimit, limit);
      node.classList.remove('wc-ok', 'wc-over');
      node.classList.add(val > limit ? 'wc-over' : 'wc-ok');
    });

    var pct = maxLimit > 0 ? Math.min(100, (chars / maxLimit) * 100) : 0;
    if (!isFinite(pct) || pct < 0) pct = 0;

    var fillEl = document.getElementById('wc-track-fill');
    if (fillEl) {
      fillEl.style.width = pct + '%';
      fillEl.style.background = chars > maxLimit ? '#ef4444' : '#502fe0';
    }
  }

  function update() {
    var r = analyze(ta.value);
    setVal(sW, r.words, prev.words);
    setVal(sC, r.chars, prev.chars);
    setVal(sCN, r.charsNS, prev.charsNS);
    setVal(sSe, r.sents, prev.sents);
    setVal(sPa, r.paras, prev.paras);
    setVal(sWPS, r.wps, prev.wps);
    setVal(sLines, r.lines, prev.lines);

    var rt = fmt(r.rS),
      st = fmt(r.spS);

    if (sRT.textContent !== rt) sRT.textContent = rt;
    if (sST.textContent !== st) sST.textContent = st;
    if (sRL.textContent !== r.level) sRL.textContent = r.level;

    updateSocial(r.chars, r.words);

    prev = { words: r.words, chars: r.chars, charsNS: r.charsNS, sents: r.sents, paras: r.paras, wps: r.wps, lines: r.lines };
    rId = null;
  }

  function schedule() {
    if (!rId) rId = requestAnimationFrame(update);
  }

  function showToast(msg) {
    clearTimeout(tT);
    toast.textContent = msg;
    toast.classList.add('wc-show');
    tT = setTimeout(function () {
      toast.classList.remove('wc-show');
    }, 2400);
  }

  function doCopy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.classList.add('wc-copied');
        showToast('✔ Copied to clipboard!');
        setTimeout(function () {
          copyBtn.classList.remove('wc-copied');
        }, 2000);
      }).catch(function () {
        fallback(text);
      });
    } else {
      fallback(text);
    }
  }

  function fallback(text) {
    var tmp = document.createElement('textarea');
    tmp.value = text;
    tmp.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none';
    document.body.appendChild(tmp);
    tmp.focus();
    tmp.select();

    try {
      document.execCommand('copy');
      copyBtn.classList.add('wc-copied');
      showToast('✔ Copied!');
      setTimeout(function () {
        copyBtn.classList.remove('wc-copied');
      }, 2000);
    } catch (e) {
      showToast('⚠️ Press Ctrl+A then Ctrl+C');
    }

    document.body.removeChild(tmp);
  }

  copyBtn.addEventListener('click', function () {
    if (!ta.value.trim()) {
      showToast('⚠️ Nothing to copy');
      return;
    }
    doCopy(ta.value);
  });

  clearBtn.addEventListener('click', function () {
    if (!ta.value) return;
    ta.value = '';
    schedule();
    ta.focus();
    showToast('🗑️ Text cleared');
  });

  downloadBtn.addEventListener('click', function () {
    if (!ta.value.trim()) {
      showToast('⚠️ Nothing to download');
      return;
    }

    var blob = new Blob([ta.value], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('⬇️ Downloaded');
  });

  uploadBtn.addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,text/plain';
    input.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function (ev) {
        ta.value = ev.target.result;
        schedule();
        showToast('📄 File loaded');
      };
      reader.onerror = function () {
        showToast('⚠️ Could not read file');
      };
      reader.readAsText(file);
    });
    input.click();
  });

  pasteBtn.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.readText && window.isSecureContext) {
      navigator.clipboard.readText().then(function (text) {
        if (!text) {
          showToast('⚠️ Clipboard is empty');
          return;
        }

        var start = ta.selectionStart || ta.value.length;
        var end = ta.selectionEnd || ta.value.length;
        ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
        ta.focus();
        ta.selectionStart = ta.selectionEnd = start + text.length;
        schedule();
        showToast('📋 Pasted');
      }).catch(function () {
        ta.focus();
        showToast('⚠️ Click the box, then press Ctrl+V (or Cmd+V)');
      });
    } else {
      ta.focus();
      showToast('⚠️ Click the box, then press Ctrl+V (or Cmd+V)');
    }
  });

  ta.addEventListener('input', schedule);
  ta.addEventListener('paste', function () {
    setTimeout(schedule, 10);
  });

  var infoWraps = document.querySelectorAll('#wc-tool .wc-info-wrap');
  infoWraps.forEach(function (wrap) {
    wrap.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = wrap.classList.contains('wc-tip-show');
      infoWraps.forEach(function (w) {
        w.classList.remove('wc-tip-show');
      });
      if (!isOpen) wrap.classList.add('wc-tip-show');
    });
  });

  document.addEventListener('click', function () {
    infoWraps.forEach(function (w) {
      w.classList.remove('wc-tip-show');
    });
  });

  update();
})();
