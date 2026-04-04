# Excel Export Feature for Survey Responses

## Overview
The admin panel now includes an Excel export feature that allows administrators to download survey responses in a formatted Excel file (.xlsx).

## Features

### ✨ Export Capabilities
- **Export All Surveys** - Download all survey responses
- **Filtered Export** - Export only surveys matching current filters
- **Category Filter** - Export surveys from specific categories
- **Search Filter** - Export surveys matching search criteria
- **Formatted Excel** - Professional formatting with headers and styling

### 📊 Excel File Contents

The exported Excel file includes all survey data:

**Personal Information:**
- ID
- Nom (Last name)
- Prénom (First name)
- Email
- Téléphone (Phone)
- Catégorie (Category)
- Détails Occupation (Occupation details)

**Survey Responses:**
- Participation Précédente (Previous participation)
- Question 1, 2, 3, 4 (Category-specific responses)
- Plus Grande Force (Greatest strength)
- Point à Améliorer (Point to improve)
- Recommandation (Would recommend)

**Metadata:**
- Adresse IP (IP address)
- Date de Soumission (Submission date)

### 🎨 Excel Formatting
- Bold header row with gray background
- Auto-sized columns for readability
- Professional appearance
- Date format: YYYY-MM-DD HH:MM:SS

## Usage

### In the Admin Panel

1. **Navigate to Admin Panel:**
   ```
   https://whataboutyou.net/#/admin
   ```

2. **Go to Sondages Tab**

3. **Apply Filters (Optional):**
   - Search by name, email
   - Filter by category
   - Results update automatically

4. **Click "Exporter vers Excel" Button:**
   - Green button in top-right of filters section
   - Shows loading spinner during export
   - File downloads automatically

5. **File Downloaded:**
   - Filename format: `sondages_YYYY-MM-DD.xlsx`
   - Example: `sondages_2025-01-15.xlsx`

### Export Scenarios

#### Export All Surveys
1. Clear all filters (select "Toutes les catégories")
2. Clear search field
3. Click "Exporter vers Excel"
4. Downloads all surveys

#### Export by Category
1. Select category from dropdown (e.g., "Participant étudiant")
2. Click "Exporter vers Excel"
3. Downloads only surveys from that category

#### Export Filtered Results
1. Enter search term (e.g., "jean")
2. Select category (optional)
3. Click "Exporter vers Excel"
4. Downloads only matching surveys

## Backend Integration

### API Endpoint
```
GET /api/surveys/export/excel
```

### Query Parameters
- `category` - Filter by specific category
- `search` - Search by name or email
- `sort` - Sort order ('asc' or 'desc')

### Example Requests

**Export All:**
```bash
curl -O https://api.whataboutyou.net/api/surveys/export/excel
```

**Export by Category:**
```bash
curl -O "https://api.whataboutyou.net/api/surveys/export/excel?category=Exposant"
```

**Export with Search:**
```bash
curl -O "https://api.whataboutyou.net/api/surveys/export/excel?search=jean"
```

**Export with Multiple Filters:**
```bash
curl -O "https://api.whataboutyou.net/api/surveys/export/excel?category=Participant%20%C3%A9tudiant&search=john&sort=asc"
```

### Response
- **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Content-Disposition:** `attachment; filename=sondages_YYYY-MM-DD.xlsx`
- **Body:** Binary Excel file data

## Implementation Details

### Frontend Changes

#### 1. Survey Service (`src/services/surveyService.ts`)
Added `exportSurveysToExcel()` function:
```typescript
export const exportSurveysToExcel = async (
  category?: string,
  search?: string,
  sort?: 'asc' | 'desc'
): Promise<Blob>
```

**Features:**
- Accepts filter parameters
- Returns Blob for file download
- Handles errors gracefully
- Uses axios with `responseType: 'blob'`

#### 2. Admin Component (`src/pages/admin/components/SurveyResponses.tsx`)
Added export functionality:
```typescript
const handleExportToExcel = async () => {
  // Get blob from API
  const blob = await exportSurveysToExcel(filterCategory, searchTerm, 'desc');

  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sondages_${today}.xlsx`;

  // Trigger download
  link.click();

  // Cleanup
  window.URL.revokeObjectURL(url);
}
```

**UI Features:**
- Green "Exporter vers Excel" button
- Loading spinner during export
- Disabled when no surveys match filters
- Error handling with user alerts

### Backend Implementation

#### 1. Service Method (`src/surveys/surveys.service.ts`)
```typescript
async exportToExcel(queryDto: QuerySurveyDto): Promise<Buffer>
```

**Process:**
1. Query Firestore with filters
2. Create Excel workbook with ExcelJS
3. Add header row with styling
4. Add data rows for each survey
5. Return buffer

#### 2. Controller Endpoint (`src/surveys/surveys.controller.ts`)
```typescript
@Get('export/excel')
async exportToExcel(@Query() queryDto: QuerySurveyDto, @Res() res: Response)
```

**Features:**
- Sets proper headers for Excel download
- Generates filename with current date
- Streams file to response

### Dependencies

**Backend:**
- `exceljs` - Excel file generation library

**Frontend:**
- `axios` - HTTP client (already installed)
- Built-in browser Blob and URL APIs

## Error Handling

### Frontend Errors

**Error Scenarios:**
1. **Network Error:** Backend not reachable
2. **Server Error:** Backend fails to generate file
3. **No Data:** No surveys match filters

**Error Display:**
- Alert with French error message
- Loading spinner stops
- Button re-enabled

### Backend Errors

**Error Scenarios:**
1. **Query Failed:** Firestore query error
2. **Export Failed:** ExcelJS generation error

**Error Response:**
```json
{
  "statusCode": 500,
  "message": "Erreur lors de l'export",
  "error": "Internal Server Error"
}
```

## User Experience

### Visual Feedback

**Before Export:**
- Green button: "Exporter vers Excel"
- Excel icon visible

**During Export:**
- Loading spinner
- Text: "Export en cours..."
- Button disabled

**After Export:**
- File downloads automatically
- Button returns to normal state
- No confirmation needed (file appears in downloads)

**Empty State:**
- Button disabled when no surveys
- Tooltip: "Aucun sondage à exporter"

### Filter Integration

**Active Filters Display:**
Shows count of matching surveys:
```
5 sondage(s) trouvé(s) dans la catégorie "Exposant" avec "jean"
```

**Empty Results:**
```
Aucun sondage ne correspond aux filtres sélectionnés
```

## Testing

### Manual Testing Steps

1. **Test Export All:**
   - Clear all filters
   - Click export button
   - Verify file downloads
   - Open Excel file
   - Check all surveys are present

2. **Test Category Filter:**
   - Select "Participant étudiant"
   - Click export
   - Verify only students in file

3. **Test Search Filter:**
   - Enter "jean" in search
   - Click export
   - Verify only matching names/emails

4. **Test Combined Filters:**
   - Select category + search term
   - Click export
   - Verify both filters applied

5. **Test Loading State:**
   - Click export
   - Observe spinner
   - Verify button disabled during export

6. **Test Empty State:**
   - Apply filters with no matches
   - Verify button is disabled
   - Check empty message displays

7. **Test Error Handling:**
   - Disconnect from network
   - Try export
   - Verify error alert shows

### Backend Testing

```bash
# Test export endpoint directly
curl -O https://api.whataboutyou.net/api/surveys/export/excel

# Test with category filter
curl -O "https://api.whataboutyou.net/api/surveys/export/excel?category=Exposant"

# Test with search
curl -O "https://api.whataboutyou.net/api/surveys/export/excel?search=test"

# Verify file downloads and opens in Excel
```

## Performance Considerations

### Frontend
- Blob handling is efficient
- Memory cleanup with `revokeObjectURL()`
- No UI blocking during download

### Backend
- Streams data efficiently
- Processes surveys in batches
- Memory-efficient with ExcelJS buffer mode

### File Size
- Average survey: ~500 bytes
- 1000 surveys: ~500 KB
- 10,000 surveys: ~5 MB
- **Recommendation:** Consider pagination for >10,000 surveys

## Security Considerations

### Authentication
⚠️ **TODO:** Add authentication guard to export endpoint

```typescript
// Backend: src/surveys/surveys.controller.ts
@Get('export/excel')
@UseGuards(JwtAuthGuard, AdminGuard)
async exportToExcel() { ... }
```

### Data Protection
- Only admin users should access export
- Contains personal information (email, phone)
- Ensure GDPR compliance in production

### Rate Limiting
- Consider adding rate limit to export endpoint
- Prevent abuse of large exports

## Future Enhancements

### Planned Features
- [ ] Export to CSV format
- [ ] Export to PDF format
- [ ] Scheduled exports (email reports)
- [ ] Custom column selection
- [ ] Export statistics summary sheet
- [ ] Date range filtering

### UI Improvements
- [ ] Export format dropdown (Excel/CSV/PDF)
- [ ] Export progress percentage
- [ ] Export history/logs
- [ ] Bulk export options

### Backend Optimizations
- [ ] Pagination for large exports
- [ ] Background job processing
- [ ] Export caching
- [ ] Compression for large files

## Troubleshooting

### Export Button Disabled

**Possible Causes:**
1. No surveys in database
2. Filters exclude all surveys
3. Export already in progress

**Solutions:**
- Clear filters
- Check if surveys exist
- Wait for current export to finish

### File Not Downloading

**Possible Causes:**
1. Browser popup blocker
2. Download folder permissions
3. Network error

**Solutions:**
- Allow popups for site
- Check browser download settings
- Verify network connection

### Excel File Corrupted

**Possible Causes:**
1. Backend error during generation
2. Network interruption
3. Browser cache issue

**Solutions:**
- Retry export
- Clear browser cache
- Check backend logs

### Export Takes Too Long

**Possible Causes:**
1. Large number of surveys
2. Backend server overload
3. Network latency

**Solutions:**
- Apply filters to reduce data
- Export during off-peak hours
- Contact system administrator

## Documentation References

- **Main Integration Guide:** `SURVEYS_FRONTEND_INTEGRATION.md`
- **Quick Start:** `QUICK_START.md`
- **Integration Summary:** `INTEGRATION_COMPLETE.md`
- **Backend Docs:** Check WAYBack repository

---

**Feature Implemented:** 2025-11-13
**Status:** ✅ Ready for Testing
**Dependencies:** exceljs (backend), axios (frontend)
**Next Steps:** Test export functionality and add authentication
