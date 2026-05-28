const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات لقراءة البيانات القادمة من الواجهات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// جعل السيرفر يقرأ الملفات العامة (الواجهات والصور) من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// تشغيل السيرفر الأساسي
app.listen(PORT, () => {
    console.log(`سيرفر Syria Tunes يعمل بنجاح على بورت ${PORT}`);
});
