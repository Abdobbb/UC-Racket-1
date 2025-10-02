document.addEventListener('DOMContentLoaded', () => {
    // 1. تعريف العناصر (مع إضافة تحقق أساسي)
    const buyButtons = document.querySelectorAll('.buy-btn');
    const modal = document.getElementById('id-modal');
    
    // **تحقق أساسي:** إذا لم يكن الـ Modal موجودًا، فلن يعمل الكود، لذا نخرج
    if (!modal) {
        console.error('Modal element with ID "id-modal" not found.');
        return; 
    }
    
    const closeBtn = document.querySelector('.close-btn');
    const confirmPurchaseBtn = document.getElementById('confirm-purchase');
    const playerIdInput = document.getElementById('player-id');
    const modalDetails = document.getElementById('modal-details');

    let selectedPackage = {};
    const WHATSAPP_PHONE_NUMBER = '201281891920';

    // دالة موحدة لإغلاق الـ Modal وتنظيف الحقول
    const closeModal = () => {
        modal.style.display = 'none'; 
        playerIdInput.value = ''; 
    };
    
    // دالة للتحقق من أن ID اللاعب صحيح (افتراض 8-12 رقمًا)
    const isValidPlayerId = (id) => {
        return /^\d{8,12}$/.test(id); 
    };

    // 2. فتح النافذة المنبثقة وتخزين تفاصيل الباقة
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.package-card');
            if (!card) return; 

            const uc = card.dataset.uc || 'غير محدد';
            let price = card.dataset.price || 'غير محدد';
            let packageName;

            // تحديد اسم الباقة
            if (card.classList.contains('popularity-card')) {
                packageName = `شحن ${uc} شعبية`;
            } else if (card.classList.contains('special-offer')) {
                price = card.dataset.priceFirst || price;
                packageName = `${uc} UC - عرض أول زيارة`;
            } else {
                packageName = `${uc} UC`;
            }

            selectedPackage = { uc: uc, price: price, name: packageName };

            modalDetails.innerHTML = `الباقة: <strong>${selectedPackage.name}</strong> <br> السعر: <strong>${selectedPackage.price} جنيه</strong>`;
            
            modal.style.display = 'block'; 
            playerIdInput.focus();
        });
    });

    // 3. إدارة إغلاق النافذة المنبثقة (نفس ما كان)
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block' && e.key === 'Escape') {
            closeModal();
        }
    });

    // 4. تأكيد الطلب وإنشاء رابط واتساب (المُعدَّل)
    if (confirmPurchaseBtn) { // **تأكدنا من أن الزر موجود قبل محاولة ربط الحدث به**
        confirmPurchaseBtn.addEventListener('click', () => {
            const playerId = playerIdInput.value.trim();
            const packagePrice = selectedPackage.price;
            const packageName = selectedPackage.name;

            // التحقق من صحة ID اللاعب
            if (!isValidPlayerId(playerId)) {
                alert('❌ من فضلك أدخل ID لاعب صحيح (يجب أن يكون بين 8 إلى 12 رقمًا).');
                playerIdInput.focus();
                return;
            }

            // نص الرسالة التلقائية للواتساب
            const message = `
أهلاً UC Racket،
أرغب في شراء الباقة التالية:
- الباقة: ${packageName}
- السعر: ${packagePrice} جنيه مصري
- ID اللاعب: ${playerId}

*تم الطلب عبر موقع UC Racket وهو ضمان حقي في الشحن. رجاء ارسل البملغ المطلوب مع صوره للتحويل لضمان حقك
(فودافون كاش) لإتمام الشحن.*
            `.trim();

            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;

            // فتح الرابط في نافذة جديدة
            window.open(whatsappURL, '_blank');

            // إغلاق النافذة المنبثقة وتنظيف الإدخال
            closeModal(); 
            
            alert('✅ تم توجيهك إلى الواتساب! يُرجى إرسال الرسالة لإتمام الطلب.');
        });
    } else {
        console.error('Confirm Purchase button with ID "confirm-purchase" not found.');
    }
});
