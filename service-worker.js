# إعداد RLS لحساب واحد

بعد التأكد من نجاح تسجيل الدخول، غيّر سياسات الجداول بحيث تسمح فقط للمستخدم المسجل صاحب UID الخاص بك.

الجداول التي يكتب فيها التطبيق:
- `program_items`: SELECT و UPDATE
- `alternatives`: SELECT و UPDATE
- `progress_accum`: SELECT و UPDATE

الجدول المرجعي:
- `catalog_exercises`: SELECT فقط

استخدم دور `authenticated`، واجعل شرط `USING` و`WITH CHECK` كالتالي بعد استبدال القيمة بمعرّف المستخدم من Authentication → Users:

```sql
auth.uid() = 'YOUR_USER_UID'::uuid
```

لا تستخدم `service_role` أو أي Secret Key داخل ملفات الواجهة.
