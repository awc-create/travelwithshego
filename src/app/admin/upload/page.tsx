'use client';

import ImageUploader from '@/components/admin/image/ImageUploader';
import { useState } from 'react';

export default function AdminUploadPage() {
  const [auctionFiles, setAuctionFiles] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<string[]>([]);
  const [testimonialFiles, setTestimonialFiles] = useState<string[]>([]);

  return (
    <section style={{ display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Upload Test</h1>
        <p style={{ opacity: 0.75 }}>
          Use this page to test image and video uploads into your Hetzner object storage.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}
      >
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: 16,
            padding: 16,
            background: '#fff',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Auction</h2>
          <p style={{ fontSize: 14, opacity: 0.75 }}>
            Stores under: <code>travel-with-shego/auction/sample-item/...</code>
          </p>

          <ImageUploader
            label="Auction media"
            single
            files={auctionFiles}
            setFiles={setAuctionFiles}
            pathSegments={['auction', 'sample-item']}
            itemName="main-image"
            accept="image/*,video/mp4,video/webm"
          />
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: 16,
            padding: 16,
            background: '#fff',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Home Gallery</h2>
          <p style={{ fontSize: 14, opacity: 0.75 }}>
            Stores under: <code>travel-with-shego/pages/home/gallery/...</code>
          </p>

          <ImageUploader
            label="Gallery images"
            files={galleryFiles}
            setFiles={setGalleryFiles}
            pathSegments={['pages', 'home', 'gallery']}
            itemName="gallery-image"
            accept="image/*"
          />
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: 16,
            padding: 16,
            background: '#fff',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Testimonial Avatar</h2>
          <p style={{ fontSize: 14, opacity: 0.75 }}>
            Stores under: <code>travel-with-shego/pages/home/testimonial/...</code>
          </p>

          <ImageUploader
            label="Avatar"
            single
            files={testimonialFiles}
            setFiles={setTestimonialFiles}
            pathSegments={['pages', 'home', 'testimonial']}
            itemName="avatar"
            accept="image/*"
          />
        </div>
      </div>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: 16,
          padding: 16,
          background: '#fafafa',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Current uploaded URLs</h3>

        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <strong>Auction:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '8px 0 0' }}>
              {JSON.stringify(auctionFiles, null, 2)}
            </pre>
          </div>

          <div>
            <strong>Gallery:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '8px 0 0' }}>
              {JSON.stringify(galleryFiles, null, 2)}
            </pre>
          </div>

          <div>
            <strong>Testimonial:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '8px 0 0' }}>
              {JSON.stringify(testimonialFiles, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
