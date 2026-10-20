/**
 * Inisialisasi Otomatis 16 Sheet pada Google Spreadsheet
 * Jalankan fungsi initializeAllSheets() satu kali di Google Apps Script editor.
 */
function initializeAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const schema = {
    'Users': ['userId', 'username', 'passwordHash', 'salt', 'role', 'status', 'mustChangePassword', 'createdAt', 'updatedAt'],
    'Teachers': ['teacherId', 'userId', 'fullName', 'employeeNumber', 'status'],
    'Students': ['studentId', 'userId', 'studentNumber', 'fullName', 'classId', 'status'],
    'Classes': ['classId', 'className', 'schoolYear', 'status'],
    'TeacherAssignments': ['assignmentId', 'teacherId', 'classId', 'startDate', 'endDate', 'status'],
    'StudentClassHistory': ['historyId', 'studentId', 'classId', 'startDate', 'endDate'],
    'Habits': ['habitId', 'name', 'description', 'illustrationRef', 'sortOrder', 'active', 'version'],
    'HabitChecklists': ['checklistId', 'habitId', 'version', 'label', 'sortOrder', 'active'],
    'Materials': ['materialId', 'habitId', 'title', 'contentType', 'contentRef', 'active', 'version'],
    'DailyJournals': ['journalId', 'studentId', 'journalDate', 'status', 'submittedAt', 'verifiedAt', 'createdAt', 'updatedAt'],
    'JournalHabitDetails': ['detailId', 'journalId', 'habitId', 'habitVersion', 'checklistSnapshot', 'notes'],
    'JournalPhotos': ['photoId', 'journalId', 'detailId', 'driveFileId', 'mimeType', 'sizeBytes', 'uploadedAt', 'status'],
    'JournalVerifications': ['verificationId', 'journalId', 'reviewerId', 'decision', 'comment', 'createdAt'],
    'JournalHistory': ['historyId', 'journalId', 'actorId', 'action', 'oldStatus', 'newStatus', 'note', 'createdAt'],
    'AuditLogs': ['logId', 'actorId', 'action', 'targetType', 'targetId', 'timestamp', 'result', 'metadataSafe'],
    'AppSettings': ['settingKey', 'settingValue', 'updatedBy', 'updatedAt']
  };

  for (const sheetName in schema) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Set Header jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      const headers = schema[sheetName];
      sheet.appendRow(headers);
      
      // Format header agar rapi
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#2563eb');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }

  Logger.log('Semua 16 sheet berhasil diinisialisasi sesuai spesifikasi PRD.');
}
