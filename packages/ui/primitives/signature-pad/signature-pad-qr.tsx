import { useEffect, useRef } from 'react';

import { Trans } from '@lingui/react/macro';
import { renderSVG } from 'uqr';

import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';

export type SignaturePadQrProps = {
  qrToken: string;
  onChange: (_value: string) => void;
};

export const SignaturePadQr = ({ qrToken, onChange }: SignaturePadQrProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const url = `${NEXT_PUBLIC_WEBAPP_URL()}/share/${qrToken}`;
    const qrSvg = renderSVG(url, { ecc: 'Q' });

    // Convert SVG to image and draw on canvas
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        onChange(canvas.toDataURL());
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(qrSvg);
  }, [qrToken, onChange]);

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <canvas ref={canvasRef} width={300} height={300} className="max-w-full rounded-lg border" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Trans>Scan to view the signing certificate and verify document authenticity</Trans>
      </p>
    </div>
  );
};
