const express = require('express');
const path = require('path');
const multer = require('multer'); // استدعاء أداة رفع الصور
const fs = require('fs'); // مكتبة النظام لإدارة المجلدات
const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات لقراءة البيانات والنصوص القادمة من الواجهات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// جعل السيرفر يقرأ الملفات العامة من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// سحر الحماية: التأكد من أن مجلد uploads موجود، وإذا لم يكن موجوداً يتم إنشاؤه تلقائياً
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
// جعل السيرفر يتيح الوصول للصور المرفوعة داخل مجلد uploads
app.use('/uploads', express.static(uploadDir));

// مخازن مؤقتة لحفظ البيانات (المقالات والصور)
let blogPosts = [];
let galleryImages = [];

// إعداد أداة Multer لتحديد أين وكيف يتم حفظ الصور المرفوعة
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // حفظها في المجلد الذكي المعرّف بالأعلى
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // تسمية الصورة برقم فريد لعدم التكرار
    }
});
const upload = multer({ storage: storage });

// === [ الروابط البرمجية - API ] ===

// 1. استقبال مقال جديد من لوحة التحكم وحفظه
app.post('/api/posts', (upload.none()), (req, res) => {
    const { title, content } = req.body;
    const newPost = { title, content, date: new Date().toLocaleDateString('ar-EG') };
    blogPosts.unshift(newPost); // إضافة المقال الجديد في بداية القائمة
    res.redirect('/blog.html'); // إعادة توجيه المستخدم لصفحة المدونة لرؤية مقاله
});

// 2. إرسال المقالات إلى صفحة المدونة
app.get('/api/posts', (req, res) => {
    res.json(blogPosts);
});

// 3. استقبال صورة جديدة من لوحة التحكم وحفظها
app.post('/api/gallery', upload.single('image'), (req, res) => {
    if (req.file) {
        const imagePath = `/uploads/${req.file.filename}`;
        galleryImages.unshift(imagePath); // إضافة الصورة في أول القائمة
    }
    res.redirect('/gallery.html'); // إعادة توجيه المستخدم لمعرض الصور لرؤية الصورة
});

// 4. إرسال الصور إلى صفحة المعرض
app.get('/api/gallery', (req, res) => {
    res.json(galleryImages);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`سيرفر Syria Tunes المحدث يعمل بنجاح على بورت ${PORT}`);
});
