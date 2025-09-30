document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.buy-btn');
    const modal = document.getElementById('id-modal');
    const closeBtn = document.querySelector('.close-btn');
    const confirmPurchaseBtn = document.getElementById('confirm-purchase');
    const playerIdInput = document.getElementById('player-id');
    const modalDetails = document.getElementById('modal-details');

    let selectedPackage = {};

    // 1. فتح النافذة المنبثقة وتخزين تفاصيل الباقة
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.package-card');
            const uc = card.dataset.uc;
            let price;
            let packageName;

            if (card.classList.contains('popularity-card')) {
                // باقة الشعبية
                price = card.dataset.price;
                packageName = `شحن ${uc} شعبية`;
            } else if (card.classList.contains('special-offer')) {
                // باقة العرض الخاص
                price = card.dataset.priceFirst;
                packageName = `${uc} UC - عرض أول زيارة`;
            } else {
                // الباقات العادية
                price = card.dataset.price;
                packageName = `${uc} UC`;
            }

            selectedPackage = { uc: uc, price: price, name: packageName };

            modalDetails.innerHTML = `الباقة: **${selectedPackage.name}** <br> السعر: **${selectedPackage.price} جنيه**`;
            modal.style.display = 'block';
            playerIdInput.focus();
        });
    });

    // 2. إغلاق النافذة المنبثقة
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // إغلاق عند الضغط خارج النافذة
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 3. تأكيد الطلب وإنشاء رابط واتساب
    confirmPurchaseBtn.addEventListener('click', () => {
        const playerId = playerIdInput.value.trim();
        const phoneNumber = '201281891920';
        const packagePrice = selectedPackage.price;
        const packageName = selectedPackage.name;

        if (playerId === '') {
            alert('من فضلك أدخل ID اللاعب لإتمام الطلب.');
            return;
        }

        // نص الرسالة التلقائية للواتساب (وهو الضمان للعميل)
        const message = `
أهلاً UC Racket،
أرغب في شراء الباقة التالية:
- الباقة: ${packageName}
- السعر: ${packagePrice} جنيه مصري
- ID اللاعب: ${playerId}

*تم الطلب عبر موقع UC Racket وهو ضمان حقي في الشحن. يرجى تأكيد العملية وإرسال تفاصيل الدفع (فودافون كاش) لإتمام الشحن.*
        `.trim();

        // ترميز الرسالة لـ URL
        const encodedMessage = encodeURIComponent(message);

        // إنشاء رابط الواتساب (لفتح التطبيق/الموقع)
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // فتح الرابط في نافذة جديدة
        window.open(whatsappURL, '_blank');

        // إغلاق النافذة المنبثقة وتنظيف الإدخال
        modal.style.display = 'none';
        playerIdInput.value = '';
       
    
        alert('تم توجيهك إلى الواتساب! يُرجى إرسال الرسالة لإتمام الطلب.');
تحياتي 
    });
    

});
