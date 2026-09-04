param(
  [string]$Source = "release/assets/geovalor-subsolo-clean-v3-8k.jpg",
  [string]$Output = "release/assets/frames",
  [int]$OutputWidth = 1920,
  [int]$OutputHeight = 1080
)

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Drawing.Common -ErrorAction SilentlyContinue

$sourcePath = [IO.Path]::GetFullPath($Source)
$outputPath = [IO.Path]::GetFullPath($Output)
New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
Get-ChildItem -LiteralPath $outputPath -Filter "frame-*.jpg" -ErrorAction SilentlyContinue | Remove-Item -Force

$src = [Drawing.Bitmap]::FromFile($sourcePath)
$outW = $OutputWidth
$outH = $OutputHeight
$srcAspect = $src.Width / [double]$src.Height
$outAspect = $outW / [double]$outH

# Every frame shares the same 16:9 canvas and derives from the same master.
# The focal points are intentionally gentle so technical overlays never jump.
$states = @(
  @{z=1.00; x=.50; y=.43; tint='none'; glow=0.00}, @{z=1.02; x=.50; y=.42; tint='none'; glow=.02},
  @{z=1.04; x=.51; y=.40; tint='amber'; glow=.04}, @{z=1.06; x=.52; y=.38; tint='amber'; glow=.06},
  @{z=1.08; x=.54; y=.34; tint='amber'; glow=.08}, @{z=1.10; x=.57; y=.31; tint='amber'; glow=.10},
  @{z=1.12; x=.60; y=.31; tint='gold'; glow=.12}, @{z=1.14; x=.63; y=.34; tint='gold'; glow=.14},
  @{z=1.16; x=.64; y=.39; tint='gold'; glow=.16}, @{z=1.16; x=.62; y=.44; tint='teal'; glow=.14},
  @{z=1.15; x=.59; y=.49; tint='teal'; glow=.12}, @{z=1.14; x=.56; y=.53; tint='teal'; glow=.10},
  @{z=1.13; x=.53; y=.57; tint='teal'; glow=.12}, @{z=1.14; x=.50; y=.61; tint='teal'; glow=.14},
  @{z=1.16; x=.48; y=.65; tint='copper'; glow=.16}, @{z=1.18; x=.46; y=.69; tint='copper'; glow=.18},
  @{z=1.20; x=.45; y=.72; tint='copper'; glow=.20}, @{z=1.20; x=.48; y=.70; tint='blue'; glow=.18},
  @{z=1.19; x=.51; y=.66; tint='blue'; glow=.16}, @{z=1.18; x=.54; y=.62; tint='blue'; glow=.14},
  @{z=1.17; x=.57; y=.59; tint='violet'; glow=.14}, @{z=1.16; x=.60; y=.57; tint='violet'; glow=.16},
  @{z=1.15; x=.62; y=.55; tint='violet'; glow=.18}, @{z=1.13; x=.61; y=.51; tint='white'; glow=.16},
  @{z=1.11; x=.58; y=.48; tint='white'; glow=.14}, @{z=1.09; x=.55; y=.46; tint='white'; glow=.10},
  @{z=1.07; x=.53; y=.45; tint='amber'; glow=.08}, @{z=1.05; x=.52; y=.44; tint='amber'; glow=.06},
  @{z=1.03; x=.51; y=.43; tint='none'; glow=.04}, @{z=1.01; x=.50; y=.43; tint='none'; glow=.02}
)

# Lock the camera to the master canvas: color/light changes only, zero drift.
$lockedTints = @('none','none','amber','amber','amber','amber','gold','gold','gold','teal','teal','teal','teal','teal','copper','copper','copper','blue','blue','blue','violet','violet','violet','white','white','white','amber','amber','none','none')
$states = 0..29 | ForEach-Object {
  @{z=1.0; x=.5; y=.5; tint=$lockedTints[$_]; glow=([Math]::Min(.18, $_ * .006))}
}

$codec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$quality = New-Object Drawing.Imaging.EncoderParameters 1
$quality.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality, [long]95)

for ($i=0; $i -lt $states.Count; $i++) {
  $state = $states[$i]
  $bmp = New-Object Drawing.Bitmap($outW, $outH, [Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([Drawing.Color]::FromArgb(5,7,8))

  if ($srcAspect -gt $outAspect) {
    $cropH = $src.Height / $state.z
    $cropW = $cropH * $outAspect
  } else {
    $cropW = $src.Width / $state.z
    $cropH = $cropW / $outAspect
  }
  $left = [Math]::Max(0, [Math]::Min($src.Width - $cropW, ($src.Width - $cropW) * $state.x))
  $top = [Math]::Max(0, [Math]::Min($src.Height - $cropH, ($src.Height - $cropH) * $state.y))
  $sourceRect = New-Object Drawing.Rectangle([int]$left, [int]$top, [int]$cropW, [int]$cropH)
  $g.DrawImage($src, (New-Object Drawing.Rectangle(0,0,$outW,$outH)), $sourceRect, [Drawing.GraphicsUnit]::Pixel)

  $alpha = [int](255 * [double]$state.glow)
  if ($alpha -gt 0) {
    $color = switch ($state.tint) {
      'amber' {$c=[Drawing.Color]::FromArgb($alpha,209,132,78); break}
      'gold' {$c=[Drawing.Color]::FromArgb($alpha,231,180,83); break}
      'teal' {$c=[Drawing.Color]::FromArgb($alpha,50,153,145); break}
      'copper' {$c=[Drawing.Color]::FromArgb($alpha,183,83,44); break}
      'blue' {$c=[Drawing.Color]::FromArgb($alpha,47,115,163); break}
      'violet' {$c=[Drawing.Color]::FromArgb($alpha,111,73,151); break}
      'white' {$c=[Drawing.Color]::FromArgb($alpha,208,222,224); break}
      default {$c=[Drawing.Color]::FromArgb(0,0,0,0); break}
    }
    $brush = New-Object Drawing.SolidBrush($c)
    $g.FillRectangle($brush, 0, 0, $outW, $outH)
    $brush.Dispose()
  }
  $vignette = New-Object Drawing.Drawing2D.LinearGradientBrush((New-Object Drawing.Point(0,0)), (New-Object Drawing.Point(0,$outH)), [Drawing.Color]::FromArgb(42,0,0,0), [Drawing.Color]::FromArgb(5,0,0,0))
  $g.FillRectangle($vignette, 0, 0, $outW, $outH)
  $vignette.Dispose()
  $g.Dispose()
  $name = "frame-{0:D2}.jpg" -f ($i + 1)
  $bmp.Save((Join-Path $outputPath $name), $codec, $quality)
  $bmp.Dispose()
}

$quality.Dispose()
$src.Dispose()
Write-Output ("Generated {0} aligned frames at {1}" -f $states.Count, $outputPath)
