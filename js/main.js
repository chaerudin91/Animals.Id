// enhanced-slider.js - JavaScript yang ditingkatkan untuk slider dokter dan testimonial

document.addEventListener('DOMContentLoaded', function() {
    // Struktur peningkatan slider dengan mempertahankan dukungan browser lama
    function enhanceSliders() {
        // Menyiapkan slider dokter
        setupDoctorSlider();
        
        // Menyiapkan slider testimonial
        setupTestimonialSlider();
        
        // Menambahkan loading effect untuk dokter (simulasi data loading)
        simulateDataLoading();
        
        // Menambahkan efek untuk tag spesialisasi dokter
        enhanceDoctorCards();
        
        // Memperbarui UI untuk mobile
        updateMobileUI();
        
        // Mendengarkan event resize untuk UI responsif
        window.addEventListener('resize', function() {
            // Delay sedikit untuk menghindari terlalu sering update
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(function() {
                updateDoctorSliderDimensions();
                updateTestimonialSliderDimensions();
                updateMobileUI();
            }, 250);
        });
    }
    
    // Fungsi untuk doctor slider
    function setupDoctorSlider() {
        const doctorsSlider = document.querySelector('.doctors-slider');
        const doctorCards = document.querySelectorAll('.doctor-card');
        const prevDoctor = document.getElementById('prev-doctor');
        const nextDoctor = document.getElementById('next-doctor');
        
        // Berhenti jika elemen tidak ada
        if (!doctorsSlider || !doctorCards.length || !prevDoctor || !nextDoctor) {
            return;
        }
        
        // Bungkus slider dalam container untuk efek visual lebih baik
        if (!doctorsSlider.parentElement.classList.contains('doctors-slider-container')) {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'doctors-slider-container';
            doctorsSlider.parentNode.insertBefore(sliderContainer, doctorsSlider);
            sliderContainer.appendChild(doctorsSlider);
        }
        
        // Variabel slider
        let currentDoctorPosition = 0;
        let cardWidth = 0;
        let maxPosition = 0;
        let visibleCards = 0;
        let totalPages = 0;
        let currentPage = 0;
        
        // Buat atau perbarui indikator scroll (dots)
        function updateScrollIndicator() {
            let scrollIndicator = document.querySelector('.slider-scroll-indicator');
            
            // Buat indikator jika belum ada
            if (!scrollIndicator) {
                scrollIndicator = document.createElement('div');
                scrollIndicator.className = 'slider-scroll-indicator';
                doctorsSlider.parentElement.parentElement.appendChild(scrollIndicator);
            } else {
                // Bersihkan indikator yang ada
                scrollIndicator.innerHTML = '';
            }
            
            // Buat dots berdasarkan jumlah halaman
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.className = 'scroll-dot';
                if (i === currentPage) {
                    dot.classList.add('active');
                }
                
                // Event dot click
                dot.addEventListener('click', function() {
                    goToPage(i);
                });
                
                scrollIndicator.appendChild(dot);
            }
        }
        
        // Fungsi untuk memperbarui dimensi slider
        function updateDoctorSliderDimensions() {
            // Perbarui lebar card berdasarkan ukuran viewport
            const cardStyle = window.getComputedStyle(doctorCards[0]);
            const marginRight = parseInt(cardStyle.marginRight) || 0;
            const gap = 25; // Sesuaikan dengan gap di CSS
            
            cardWidth = doctorCards[0].offsetWidth + gap;
            
            // Tentukan jumlah card yang terlihat berdasarkan ukuran layar
            if (window.innerWidth >= 1200) {
                visibleCards = 4; // 4 cards on desktop
            } else if (window.innerWidth >= 992) {
                visibleCards = 3; // 3 cards on medium screens
            } else if (window.innerWidth >= 768) {
                visibleCards = 2; // 2 cards on tablets
            } else {
                visibleCards = 1; // 1 card on mobile
            }
            
            // Hitung jumlah halaman
            totalPages = Math.ceil(doctorCards.length / visibleCards);
            
            // Hitung posisi maksimum
            maxPosition = Math.max(0, (doctorCards.length - visibleCards) * cardWidth);
            
            // Reset posisi jika posisi saat ini lebih dari maksimum
            if (currentDoctorPosition > maxPosition) {
                currentDoctorPosition = maxPosition;
                currentPage = totalPages - 1;
                updateDoctorSliderPosition();
            }
            
            // Perbarui indikator scroll
            updateScrollIndicator();
        }
        
        // Fungsi untuk memperbarui posisi slider
        function updateDoctorSliderPosition() {
            doctorsSlider.style.transform = `translateX(-${currentDoctorPosition}px)`;
            
            // Perbarui status tombol (disabled jika di ujung)
            prevDoctor.disabled = currentDoctorPosition === 0;
            nextDoctor.disabled = currentDoctorPosition >= maxPosition;
            
            // Tambahkan class visual untuk disabled state
            if (prevDoctor.disabled) {
                prevDoctor.classList.add('disabled');
            } else {
                prevDoctor.classList.remove('disabled');
            }
            
            if (nextDoctor.disabled) {
                nextDoctor.classList.add('disabled');
            } else {
                nextDoctor.classList.remove('disabled');
            }
            
            // Perbarui indikator halaman aktif
            document.querySelectorAll('.slider-scroll-indicator .scroll-dot').forEach((dot, index) => {
                if (index === currentPage) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Fungsi untuk pindah ke halaman tertentu
        function goToPage(pageIndex) {
            currentPage = pageIndex;
            currentDoctorPosition = Math.min(maxPosition, pageIndex * visibleCards * cardWidth);
            updateDoctorSliderPosition();
            
            // Animasi halus untuk scroll indicator
            document.querySelectorAll('.slider-scroll-indicator .scroll-dot').forEach((dot, index) => {
                if (index === currentPage) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Event untuk tombol navigasi
        prevDoctor.addEventListener('click', function() {
            if (currentDoctorPosition > 0) {
                currentPage = Math.max(0, currentPage - 1);
                currentDoctorPosition = currentPage * visibleCards * cardWidth;
                updateDoctorSliderPosition();
            }
        });
        
        nextDoctor.addEventListener('click', function() {
            if (currentDoctorPosition < maxPosition) {
                currentPage = Math.min(totalPages - 1, currentPage + 1);
                currentDoctorPosition = currentPage * visibleCards * cardWidth;
                updateDoctorSliderPosition();
            }
        });
        
        // Touch event support
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        doctorsSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        doctorsSlider.addEventListener('touchmove', function(e) {
            // Prevent default hanya jika scroll horizontal lebih dominan
            const touchCurrentX = e.changedTouches[0].screenX;
            const touchCurrentY = e.changedTouches[0].screenY;
            const diffX = Math.abs(touchCurrentX - touchStartX);
            const diffY = Math.abs(touchCurrentY - touchStartY);
            
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        
        doctorsSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            // Verifikasi apakah ini adalah swipe horizontal
            const diffX = Math.abs(touchEndX - touchStartX);
            const diffY = Math.abs(touchEndY - touchStartY);
            
            if (diffX > diffY && diffX > 50) {
                // Swipe threshold 50px
                if (touchEndX < touchStartX) {
                    // Swipe kiri (next)
                    if (currentDoctorPosition < maxPosition) {
                        currentPage = Math.min(totalPages - 1, currentPage + 1);
                        currentDoctorPosition = currentPage * visibleCards * cardWidth;
                        updateDoctorSliderPosition();
                    }
                } else {
                    // Swipe kanan (prev)
                    if (currentDoctorPosition > 0) {
                        currentPage = Math.max(0, currentPage - 1);
                        currentDoctorPosition = currentPage * visibleCards * cardWidth;
                        updateDoctorSliderPosition();
                    }
                }
            }
        });
        
        // Animasi otomatis slider
        let autoSlideInterval;
        const AUTOSLIDE_INTERVAL = 5000; // 5 detik
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                if (currentDoctorPosition < maxPosition) {
                    currentPage = Math.min(totalPages - 1, currentPage + 1);
                    currentDoctorPosition = currentPage * visibleCards * cardWidth;
                } else {
                    currentPage = 0;
                    currentDoctorPosition = 0;
                }
                updateDoctorSliderPosition();
            }, AUTOSLIDE_INTERVAL);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Start auto-sliding
        startAutoSlide();
        
        // Pause on hover/touch
        doctorsSlider.addEventListener('mouseenter', stopAutoSlide);
        doctorsSlider.addEventListener('mouseleave', startAutoSlide);
        doctorsSlider.addEventListener('touchstart', stopAutoSlide, { passive: true });
        doctorsSlider.addEventListener('touchend', function() {
            // Delay sebentar sebelum memulai ulang
            setTimeout(startAutoSlide, 2000);
        });
        
        // Pause hover pada navigasi
        prevDoctor.addEventListener('mouseenter', stopAutoSlide);
        prevDoctor.addEventListener('mouseleave', startAutoSlide);
        nextDoctor.addEventListener('mouseenter', stopAutoSlide);
        nextDoctor.addEventListener('mouseleave', startAutoSlide);
        
        // Inisialisasi dimensi slider
        updateDoctorSliderDimensions();
        
        // Jalankan update posisi sekali untuk keadaan awal
        updateDoctorSliderPosition();
        
        // Keyboard navigation support
        document.addEventListener('keydown', function(e) {
            if (isElementInViewport(doctorsSlider)) {
                if (e.key === 'ArrowLeft') {
                    if (currentDoctorPosition > 0) {
                        currentPage = Math.max(0, currentPage - 1);
                        currentDoctorPosition = currentPage * visibleCards * cardWidth;
                        updateDoctorSliderPosition();
                    }
                } else if (e.key === 'ArrowRight') {
                    if (currentDoctorPosition < maxPosition) {
                        currentPage = Math.min(totalPages - 1, currentPage + 1);
                        currentDoctorPosition = currentPage * visibleCards * cardWidth;
                        updateDoctorSliderPosition();
                    }
                }
            }
        });
    }
    
    // Fungsi untuk testimonial slider (mirip dengan doctor slider)
    function setupTestimonialSlider() {
        const testimonialsSlider = document.querySelector('.testimonials-slider');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const prevTestimonial = document.getElementById('prev-testimonial');
        const nextTestimonial = document.getElementById('next-testimonial');
        
        // Berhenti jika elemen tidak ada
        if (!testimonialsSlider || !testimonialCards.length || !prevTestimonial || !nextTestimonial) {
            return;
        }
        
        // Bungkus slider dalam container untuk efek visual lebih baik
        if (!testimonialsSlider.parentElement.classList.contains('testimonials-slider-container')) {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'testimonials-slider-container';
            testimonialsSlider.parentNode.insertBefore(sliderContainer, testimonialsSlider);
            sliderContainer.appendChild(testimonialsSlider);
        }
        
        // Variabel slider
        let currentTestimonialPosition = 0;
        let cardWidth = 0;
        let maxPosition = 0;
        let visibleCards = 0;
        let totalPages = 0;
        let currentPage = 0;
        
        // Buat atau perbarui indikator scroll (dots)
        function updateScrollIndicator() {
            let scrollIndicator = document.querySelector('.testimonials-section .slider-scroll-indicator');
            
            // Buat indikator jika belum ada
            if (!scrollIndicator) {
                scrollIndicator = document.createElement('div');
                scrollIndicator.className = 'slider-scroll-indicator';
                testimonialsSlider.parentElement.parentElement.appendChild(scrollIndicator);
            } else {
                // Bersihkan indikator yang ada
                scrollIndicator.innerHTML = '';
            }
            
            // Buat dots berdasarkan jumlah halaman
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.className = 'scroll-dot';
                if (i === currentPage) {
                    dot.classList.add('active');
                }
                
                // Event dot click
                dot.addEventListener('click', function() {
                    goToPage(i);
                });
                
                scrollIndicator.appendChild(dot);
            }
        }
        
        // Fungsi untuk memperbarui dimensi slider
        function updateTestimonialSliderDimensions() {
            // Perbarui lebar card berdasarkan ukuran viewport
            const cardStyle = window.getComputedStyle(testimonialCards[0]);
            const marginRight = parseInt(cardStyle.marginRight) || 0;
            const gap = 25; // Sesuaikan dengan gap di CSS
            
            cardWidth = testimonialCards[0].offsetWidth + gap;
            
            // Tentukan jumlah card yang terlihat berdasarkan ukuran layar
            if (window.innerWidth >= 1200) {
                visibleCards = 3; // 3 cards on large desktop
            } else if (window.innerWidth >= 992) {
                visibleCards = 2; // 2 cards on desktop
            } else if (window.innerWidth >= 768) {
                visibleCards = 2; // 2 cards on tablets
            } else {
                visibleCards = 1; // 1 card on mobile
            }
            
            // Hitung jumlah halaman
            totalPages = Math.ceil(testimonialCards.length / visibleCards);
            
            // Hitung posisi maksimum
            maxPosition = Math.max(0, (testimonialCards.length - visibleCards) * cardWidth);
            
            // Reset posisi jika posisi saat ini lebih dari maksimum
            if (currentTestimonialPosition > maxPosition) {
                currentTestimonialPosition = maxPosition;
                currentPage = totalPages - 1;
                updateTestimonialSliderPosition();
            }
            
            // Perbarui indikator scroll
            updateScrollIndicator();
        }
        
        // Fungsi untuk memperbarui posisi slider
        function updateTestimonialSliderPosition() {
            testimonialsSlider.style.transform = `translateX(-${currentTestimonialPosition}px)`;
            
            // Perbarui status tombol
            prevTestimonial.disabled = currentTestimonialPosition === 0;
            nextTestimonial.disabled = currentTestimonialPosition >= maxPosition;
            
            // Tambahkan class visual untuk disabled state
            if (prevTestimonial.disabled) {
                prevTestimonial.classList.add('disabled');
            } else {
                prevTestimonial.classList.remove('disabled');
            }
            
            if (nextTestimonial.disabled) {
                nextTestimonial.classList.add('disabled');
            } else {
                nextTestimonial.classList.remove('disabled');
            }
            
            // Perbarui indikator halaman aktif
            document.querySelectorAll('.testimonials-section .slider-scroll-indicator .scroll-dot').forEach((dot, index) => {
                if (index === currentPage) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Fungsi untuk pindah ke halaman tertentu
        function goToPage(pageIndex) {
            currentPage = pageIndex;
            currentTestimonialPosition = Math.min(maxPosition, pageIndex * visibleCards * cardWidth);
            updateTestimonialSliderPosition();
        }
        
        // Event untuk tombol navigasi
        prevTestimonial.addEventListener('click', function() {
            if (currentTestimonialPosition > 0) {
                currentPage = Math.max(0, currentPage - 1);
                currentTestimonialPosition = currentPage * visibleCards * cardWidth;
                updateTestimonialSliderPosition();
            }
        });
        
        nextTestimonial.addEventListener('click', function() {
            if (currentTestimonialPosition < maxPosition) {
                currentPage = Math.min(totalPages - 1, currentPage + 1);
                currentTestimonialPosition = currentPage * visibleCards * cardWidth;
                updateTestimonialSliderPosition();
            }
        });
        
        // Touch event support
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        testimonialsSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        testimonialsSlider.addEventListener('touchmove', function(e) {
            // Prevent default hanya jika scroll horizontal lebih dominan
            const touchCurrentX = e.changedTouches[0].screenX;
            const touchCurrentY = e.changedTouches[0].screenY;
            const diffX = Math.abs(touchCurrentX - touchStartX);
            const diffY = Math.abs(touchCurrentY - touchStartY);
            
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        
        testimonialsSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            // Verifikasi apakah ini adalah swipe horizontal
            const diffX = Math.abs(touchEndX - touchStartX);
            const diffY = Math.abs(touchEndY - touchStartY);
            
            if (diffX > diffY && diffX > 50) {
                // Swipe threshold 50px
                if (touchEndX < touchStartX) {
                    // Swipe kiri (next)
                    if (currentTestimonialPosition < maxPosition) {
                        currentPage = Math.min(totalPages - 1, currentPage + 1);
                        currentTestimonialPosition = currentPage * visibleCards * cardWidth;
                        updateTestimonialSliderPosition();
                    }
                } else {
                    // Swipe kanan (prev)
                    if (currentTestimonialPosition > 0) {
                        currentPage = Math.max(0, currentPage - 1);
                        currentTestimonialPosition = currentPage * visibleCards * cardWidth;
                        updateTestimonialSliderPosition();
                    }
                }
            }
        });
        
        // Animasi otomatis slider
        let autoSlideInterval;
        const AUTOSLIDE_INTERVAL = 6000; // 6 detik
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                if (currentTestimonialPosition < maxPosition) {
                    currentPage = Math.min(totalPages - 1, currentPage + 1);
                    currentTestimonialPosition = currentPage * visibleCards * cardWidth;
                } else {
                    currentPage = 0;
                    currentTestimonialPosition = 0;
                }
                updateTestimonialSliderPosition();
            }, AUTOSLIDE_INTERVAL);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Start auto-sliding
        startAutoSlide();
        
        // Pause on hover/touch
        testimonialsSlider.addEventListener('mouseenter', stopAutoSlide);
        testimonialsSlider.addEventListener('mouseleave', startAutoSlide);
        testimonialsSlider.addEventListener('touchstart', stopAutoSlide, { passive: true });
        testimonialsSlider.addEventListener('touchend', function() {
            // Delay sebentar sebelum memulai ulang
            setTimeout(startAutoSlide, 2000);
        });
        
        // Pause hover pada navigasi
        prevTestimonial.addEventListener('mouseenter', stopAutoSlide);
        prevTestimonial.addEventListener('mouseleave', startAutoSlide);
        nextTestimonial.addEventListener('mouseenter', stopAutoSlide);
        nextTestimonial.addEventListener('mouseleave', startAutoSlide);
        
        // Inisialisasi dimensi slider
        updateTestimonialSliderDimensions();
        
        // Jalankan update posisi sekali untuk keadaan awal
        updateTestimonialSliderPosition();
        
        // Add verified tag to testimonials
        testimonialCards.forEach(card => {
            const authorInfo = card.querySelector('.author-info');
            if (authorInfo) {
                const verifiedTag = document.createElement('div');
                verifiedTag.className = 'verified-tag';
                verifiedTag.innerHTML = '<i class="fas fa-check-circle"></i> Terverifikasi';
                authorInfo.appendChild(verifiedTag);
            }
        });
    }
    
    // Menambahkan loading effect pada card dokter
    function simulateDataLoading() {
        const doctorCards = document.querySelectorAll('.doctor-card');
        
        // Tampilkan skeleton loading pada beberapa card
        doctorCards.forEach((card, index) => {
            if (index > 0 && index < 3) { // Hanya card 1 dan 2 yang akan mendapat efek loading
                card.classList.add('loading');
                
                // Simpan konten asli
                const cardHTML = card.innerHTML;
                
                // Skeleton untuk gambar dan konten
                card.innerHTML = `
                    <div class="doctor-image"></div>
                    <div class="doctor-info">
                        <h3></h3>
                        <p class="doctor-specialty"></p>
                        <div class="doctor-rating"></div>
                        <p class="doctor-experience"></p>
                        <div class="btn"></div>
                    </div>
                `;
                
                // Tampilkan konten asli setelah simulasi loading
                setTimeout(() => {
                    card.innerHTML = cardHTML;
                    card.classList.remove('loading');
                    
                    // Tambahkan specialty tag setelah loading
                    addSpecialtyTag(card);
                }, 1500 + (index * 500)); // Staggered loading
            } else {
                // Tambahkan specialty tag ke card yang tidak perlu loading
                addSpecialtyTag(card);
            }
        });
    }
    
    // Tambahkan tag spesialisasi ke card dokter
    function addSpecialtyTag(card) {
        const doctorImage = card.querySelector('.doctor-image');
        const specialty = card.querySelector('.doctor-specialty');
        
        if (doctorImage && specialty && !card.querySelector('.doctor-specialty-tag')) {
            const specialtyTag = document.createElement('div');
            specialtyTag.className = 'doctor-specialty-tag';
            specialtyTag.textContent = specialty.textContent;
            doctorImage.appendChild(specialtyTag);
        }
    }
    
    // Fungsi untuk meningkatkan tampilan card dokter
    function enhanceDoctorCards() {
        const doctorCards = document.querySelectorAll('.doctor-card');
        
        doctorCards.forEach(card => {
            // Tambahkan efek hover yang lebih menarik
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px)';
                this.style.boxShadow = '0 20px 40px rgba(255, 122, 0, 0.2)';
                
                // Animate specialty tag
                const specialtyTag = this.querySelector('.doctor-specialty-tag');
                if (specialtyTag) {
                    specialtyTag.style.opacity = '1';
                    specialtyTag.style.transform = 'translateY(0)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                
                // Reset specialty tag
                const specialtyTag = this.querySelector('.doctor-specialty-tag');
                if (specialtyTag) {
                    specialtyTag.style.opacity = '';
                    specialtyTag.style.transform = '';
                }
            });
        });
    }
    
    // Helper function untuk cek apakah elemen dalam viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Update UI untuk perangkat mobile
    function updateMobileUI() {
        // Terapkan kelas khusus untuk mobile
        if (window.innerWidth <= 768) {
            document.body.classList.add('is-mobile');
            
            // Pastikan slider berfungsi dengan baik di mobile
            const sliders = document.querySelectorAll('.doctors-slider, .testimonials-slider');
            sliders.forEach(slider => {
                slider.style.overflow = 'visible';
                slider.style.webkitOverflowScrolling = 'touch';
            });
            
            // Tambahkan hint swipe untuk mobile
            addSwipeHint();
        } else {
            document.body.classList.remove('is-mobile');
            
            // Reset overflow untuk desktop
            const sliders = document.querySelectorAll('.doctors-slider, .testimonials-slider');
            sliders.forEach(slider => {
                slider.style.overflow = '';
                slider.style.webkitOverflowScrolling = '';
            });
            
            // Hapus hint swipe
            removeSwipeHint();
        }
    }
    
    // Tambahkan hint swipe untuk mobile
    function addSwipeHint() {
        const sliders = [
            document.querySelector('.doctors-slider-container'),
            document.querySelector('.testimonials-slider-container')
        ];
        
        sliders.forEach(slider => {
            if (slider && !slider.querySelector('.swipe-hint')) {
                const hint = document.createElement('div');
                hint.className = 'swipe-hint';
                hint.innerHTML = '<i class="fas fa-hand-pointer"></i> Geser untuk melihat lebih banyak';
                hint.style.cssText = `
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 122, 0, 0.9);
                    color: white;
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-size: 12px;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                    animation: fadeOut 3s forwards 2s;
                `;
                
                // Style untuk animasi fadeOut
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fadeOut {
                        to { opacity: 0; visibility: hidden; }
                    }
                `;
                document.head.appendChild(style);
                
                slider.appendChild(hint);
                
                // Hapus hint setelah beberapa detik
                setTimeout(() => {
                    hint.remove();
                }, 5000);
            }
        });
    }
    
    // Hapus hint swipe
    function removeSwipeHint() {
        document.querySelectorAll('.swipe-hint').forEach(hint => {
            hint.remove();
        });
    }
    
    // Jalankan peningkatan slider
    enhanceSliders();
});