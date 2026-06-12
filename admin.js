// ===== ADMIN.JS - PERISAI TOTAL ANTI-BOCOR IKLAN =====

(function() {
  const params = new URLSearchParams(window.location.search);
  const isAdminActive = params.get('tes') === '@analisa';

  if (isAdminActive) {
    // 1. Tambahkan class .admin-mode ke tag HTML teratas agar CSS penyembunyian langsung aktif
    document.documentElement.classList.add('admin-mode');

    // 2. Fungsi pembersihan elemen iklan secara agresif di Rumah 1 dan Rumah 2
    const bersihkanSemuaIklan = () => {
      if (document.body) {
        document.body.classList.add('admin-mode');

        // PENGAMAN RUMAH 1: Kosongkan slot ad-slot agar script iklan luar tidak dimuat
        const adSlotsRumah1 = document.querySelectorAll('.ad-slot');
        adSlotsRumah1.forEach(slot => {
          slot.innerHTML = '<div style="padding:15px; text-align:center; color:#888; font-size:11px; border:1px dashed #ccc; width:100%;">[Iklan Rumah 1 Diblokir - Admin Mode]</div>';
        });

        // PENGAMAN RUMAH 2: Cari slot tempat iframe iklan berada
        const slotIklanRumah2 = document.getElementById('bannerSlot');
        if (slotIklanRumah2) {
          // Hancurkan total isi slot iklan agar iframe rumah_iklan2.html tidak di-load
          slotIklanRumah2.innerHTML = '<div style="padding:20px; text-align:center; color:#888; font-size:12px; border:1.5px dashed #ccc; background:#f9f9f9; border-radius:4px; font-weight:600;">[Iklan Rumah 2 & Popunder Diblokir - Admin Mode]</div>';
        }

        console.log('%c [DIVDOWN SECURITY] Tameng Admin Aktif: Semua Iklan & Popunder Diblokir Total! ', 'background: #d4edda; color: #155724; font-weight: bold; padding: 6px; border: 1px solid #c3e6cb; border-radius: 4px;');
      } else {
        // Jika body belum siap, ulangi dengan cepat
        setTimeout(bersihkanSemuaIklan, 5);
      }
    };
    
    // Jalankan penghancuran iklan sesegera mungkin
    bersihkanSemuaIklan();

    // 3. PENGAMAN POPUNDER: Cegah pengiriman sinyal trigger ke iframe jika ada script nakal yang memanggil
    const originalPostMessage = window.postMessage;
    window.postMessage = function(message, targetOrigin, transfer) {
      if (message === 'triggerPopunder') {
        console.warn('[DIVDOWN SECURITY] Sinyal Popunder dideteksi dan diblokir secara paksa!');
        return; // Blokir pengiriman pesan popunder
      }
      return originalPostMessage.apply(this, arguments);
    };

    // Dengarkan juga pesan masuk untuk memblokir jika sinyal dipicu dari tempat lain
    window.addEventListener('message', function(e) {
      if (e.data === 'triggerPopunder') {
        e.stopImmediatePropagation();
        console.warn('[DIVDOWN SECURITY] Sinyal masuk Popunder dibatalkan!');
      }
    }, true);
  }
})();
