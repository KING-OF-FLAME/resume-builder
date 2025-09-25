<?php
// --- FINAL SCRIPT WITH CORRECTED SPACING ---

ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error_log.txt');
ini_set('display_errors', 0);
error_reporting(E_ALL);

if (ob_get_level()) {
    ob_end_clean();
}
ob_start();

require(__DIR__ . '/fpdf/fpdf.php');

function clean($text) {
    if ($text === null) return '';
    $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
    return iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
}

class PDF extends FPDF {
    var $mainColumnWidth = 115;
    var $sidebarWidth = 55;
    var $primaryColor = [74, 144, 226];
    var $textColor = [51, 61, 71];
    var $secondaryTextColor = [110, 122, 138];

    function SidebarTitle($title) {
        $this->SetFont('Helvetica', 'B', 11);
        $this->SetTextColor($this->primaryColor[0], $this->primaryColor[1], $this->primaryColor[2]);
        $this->Cell($this->sidebarWidth, 5, clean(strtoupper($title)), 0, 1, 'L');
        $this->SetDrawColor(220, 220, 220);
        $this->Line($this->GetX(), $this->GetY(), $this->GetX() + $this->sidebarWidth, $this->GetY());
        $this->Ln(4);
    }
    
    function MainTitle($title) {
        $this->SetFont('Helvetica', 'B', 12);
        $this->SetTextColor($this->primaryColor[0], $this->primaryColor[1], $this->primaryColor[2]);
        $this->Cell($this->mainColumnWidth, 5, clean(strtoupper($title)), 0, 1, 'L');
        $this->SetDrawColor(220, 220, 220);
        $this->Line($this->GetX(), $this->GetY(), $this->GetX() + $this->mainColumnWidth, $this->GetY());
        $this->Ln(4);
    }

    function BulletItem($text) {
        $this->SetFont('Helvetica', '', 9);
        $this->SetTextColor($this->textColor[0], $this->textColor[1], $this->textColor[2]);
        $current_x = $this->GetX();
        $this->Cell(3, 5, chr(149), 0, 0);
        $this->SetX($current_x + 4);
        $this->MultiCell($this->mainColumnWidth - 4, 5, clean($text));
        $this->Ln(1);
    }

    function SetAliasNbPages($alias='{nb}') {
        $this->AliasNbPages = $alias;
    }
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data === null) {
    ob_end_clean();
    http_response_code(400);
    exit;
}

$pdf = new PDF('P', 'mm', 'A4');
$pdf->AddPage();
$pdf->SetMargins(15, 15, 15);
$pdf->SetAutoPageBreak(false);

// --- HEADER ---
$pdf->SetFont('Helvetica', 'B', 32);
$pdf->SetTextColor($pdf->textColor[0], $pdf->textColor[1], $pdf->textColor[2]);
$pdf->Cell(0, 12, clean($data['fullName']), 0, 1, 'C');
$pdf->SetFont('Helvetica', '', 14);
$pdf->SetTextColor($pdf->primaryColor[0], $pdf->primaryColor[1], $pdf->primaryColor[2]);
$pdf->Cell(0, 7, clean($data['jobTitle']), 0, 1, 'C');
$pdf->Ln(5);

$Y_After_Header = $pdf->GetY();

// --- COLUMN DEFINITIONS ---
$leftMargin = 15;
$gutter = 5;
$main_content_x = $leftMargin;
$sidebar_x = $leftMargin + $pdf->mainColumnWidth + $gutter;

// --- RENDER SIDEBAR (RIGHT COLUMN) ---
$pdf->SetY($Y_After_Header);
$pdf->SetX($sidebar_x);
$pdf->SetLeftMargin($sidebar_x);

// Sidebar - Contact
if (!empty($data['email']) || !empty($data['phone']) || !empty($data['location'])) {
    $pdf->SidebarTitle('Contact');
    $pdf->SetFont('Helvetica', '', 8);
    $pdf->SetTextColor($pdf->textColor[0], $pdf->textColor[1], $pdf->textColor[2]);
    if (!empty($data['location'])) $pdf->MultiCell($pdf->sidebarWidth, 4.5, clean($data['location']));
    if (!empty($data['email'])) $pdf->MultiCell($pdf->sidebarWidth, 4.5, clean($data['email']));
    if (!empty($data['phone'])) $pdf->MultiCell($pdf->sidebarWidth, 4.5, clean($data['phone']));
    if (!empty($data['socialLinks'])) {
        foreach($data['socialLinks'] as $link) {
            if(!empty($link['socialURL'])) $pdf->MultiCell($pdf->sidebarWidth, 4.5, clean($link['socialURL']));
        }
    }
    $pdf->Ln(5);
}

// Sidebar - Skills
if (!empty($data['skills'])) {
    $pdf->SidebarTitle('Skills');
    $pdf->SetFont('Helvetica', '', 8);
    $pdf->SetTextColor($pdf->textColor[0], $pdf->textColor[1], $pdf->textColor[2]);
    $skills = explode(',', $data['skills']);
    foreach ($skills as $skill) {
        $skill = trim($skill);
        if ($skill) {
            $pdf->SetX($sidebar_x);
            $pdf->Cell(3, 5, chr(149), 0, 0);
            $pdf->MultiCell($pdf->sidebarWidth - 3, 5, clean($skill));
        }
    }
    $pdf->Ln(5);
}

// Sidebar - Education
if (!empty($data['education'])) {
    $pdf->SidebarTitle('Education');
    foreach ($data['education'] as $edu) {
        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->MultiCell($pdf->sidebarWidth, 5, clean($edu['eduDegree']));
        $pdf->SetFont('Helvetica', '', 8);
        $pdf->MultiCell($pdf->sidebarWidth, 4, clean($edu['eduInstitution']));
        $pdf->SetFont('Helvetica', 'I', 8);
        $pdf->SetTextColor($pdf->secondaryTextColor[0], $pdf->secondaryTextColor[1], $pdf->secondaryTextColor[2]);
        $pdf->MultiCell($pdf->sidebarWidth, 4, clean($edu['eduDates']));
        $pdf->SetTextColor($pdf->textColor[0], $pdf->textColor[1], $pdf->textColor[2]);
        $pdf->Ln(2);
    }
    $pdf->Ln(3);
}

// Sidebar - Certifications
if (!empty($data['certifications'])) {
    $pdf->SidebarTitle('Certifications');
    foreach ($data['certifications'] as $cert) {
        $pdf->SetFont('Helvetica', '', 8);
        $pdf->MultiCell($pdf->sidebarWidth, 4, clean($cert['certName']) . ' - ' . clean($cert['certIssuer']));
    }
    $pdf->Ln(5);
}

// Sidebar - Languages (FIXED)
if (!empty($data['languages'])) {
    $pdf->SidebarTitle('Languages');
    foreach ($data['languages'] as $lang) {
        $pdf->SetFont('Helvetica', '', 8);
        $pdf->SetTextColor($pdf->textColor[0], $pdf->textColor[1], $pdf->textColor[2]);
        // Use Cell for single line entries to prevent weird wrapping
        $pdf->Cell($pdf->sidebarWidth, 5, clean($lang['langName']) . ' (' . clean($lang['langProf']) . ')', 0, 1);
    }
    $pdf->Ln(5);
}

// --- RENDER MAIN CONTENT (LEFT COLUMN) ---
$pdf->SetY($Y_After_Header);
$pdf->SetX($main_content_x);
$pdf->SetLeftMargin($main_content_x);

// Main - Summary
if (!empty($data['summary'])) {
    $pdf->MainTitle('Summary');
    $pdf->SetFont('Helvetica', '', 8);
    $pdf->SetTextColor($pdf->textColor[0], $pdf->textColor[1], $pdf->textColor[2]);
    $pdf->MultiCell($pdf->mainColumnWidth, 5, clean($data['summary']));
    $pdf->Ln(5);
}

// Main - Experience
if (!empty($data['experience'])) {
    $pdf->MainTitle('Work Experience');
    foreach ($data['experience'] as $exp) {
        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->MultiCell($pdf->mainColumnWidth, 5, clean($exp['expTitle']));
        $pdf->SetFont('Helvetica', 'I', 8);
        $pdf->SetTextColor($pdf->secondaryTextColor[0], $pdf->secondaryTextColor[1], $pdf->secondaryTextColor[2]);
        $pdf->MultiCell($pdf->mainColumnWidth, 5, clean($exp['expCompany']) . ' | ' . clean($exp['expDates']));
        $pdf->SetTextColor($pdf->textColor[0], $pdf->textColor[1], $pdf->textColor[2]);
        if (!empty($exp['expDesc'])) {
            $desc_points = explode(';', $exp['expDesc']);
            foreach ($desc_points as $point) {
                if(trim($point)) $pdf->BulletItem($point);
            }
        }
        $pdf->Ln(3);
    }
    $pdf->Ln(2);
}

// Main - Projects (FIXED)
if (!empty($data['projects'])) {
    $pdf->MainTitle('Projects');
    foreach ($data['projects'] as $proj) {
        $pdf->SetFont('Helvetica', 'B', 8);
        // Use Cell for the title line to keep it on one line
        $pdf->Cell($pdf->mainColumnWidth, 5, clean($proj['projName']) . ' | ' . clean($proj['projLink']), 0, 1);
        $pdf->SetFont('Helvetica', '', 8);
        $pdf->MultiCell($pdf->mainColumnWidth, 5, clean($proj['projDesc']));
        $pdf->Ln(3);
    }
    $pdf->Ln(2);
}

// Main - Achievements
if (!empty($data['achievements'])) {
    $pdf->MainTitle('Achievements');
    $ach_points = explode(';', $data['achievements']);
    foreach ($ach_points as $point) {
        if(trim($point)) $pdf->BulletItem($point);
    }
    $pdf->Ln(3);
}

// --- FINAL OUTPUT ---
ob_end_clean();
$pdf->Output('D', 'resume.pdf');