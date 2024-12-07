import fs from 'fs';
import crypto from 'crypto';

export function cidHashFile(path:string, callback: (hash: string) => void) {
  const h = crypto.createHash('sha1');
  const size = fs.statSync(path).size;
  
  const stream = fs.createReadStream(path, { highWaterMark: 0x5000 });
  
  // Function to update hash in chunks
  function updateHash() {
      let chunk;
      
      while (null !== (chunk = stream.read())) {
          h.update(chunk);
      }
  }

  stream.on('data', updateHash);
  
  stream.on('end', () => {
      if (size >= 0xF000) {
          const fd = fs.openSync(path, 'r');
          
          // Read first 0x5000 bytes
          let buffer = Buffer.alloc(0x5000);
          fs.readSync(fd, buffer, 0, 0x5000, 0);
          h.update(buffer);
          
          // Read around 1/3 position
          const middlePos = Math.floor(size / 3);
          buffer = Buffer.alloc(0x5000);
          fs.readSync(fd, buffer, 0, 0x5000, middlePos);
          h.update(buffer);
          
          // Read last 0x5000 bytes
          const lastPos = size - 0x5000;
          buffer = Buffer.alloc(0x5000);
          fs.readSync(fd, buffer, 0, 0x5000, lastPos);
          h.update(buffer);
          
          fs.closeSync(fd);
      } else {
          // For small files, just update with the entire file's content
          stream.read(); // Ensure the stream ends
      }

      callback(h.digest('hex').toUpperCase());
  });
}
export function gcidHashFile(path:string,fn:(hash:string)=>void) {
  const h = crypto.createHash('sha1');
  const size = fs.statSync(path).size;
  let psize = 0x40000;

  while (size / psize > 0x200 && psize < 0x200000) {
    psize = psize << 1;
  }

  const stream = fs.createReadStream(path, { highWaterMark: psize });
  stream.on('data', (chunk) => {
    h.update(crypto.createHash('sha1').update(chunk).digest());
  });

  stream.on('end', () => {
    const result = h.digest('hex').toUpperCase();
    fn(result)
  });

  stream.on('error', (err) => {
    console.error('File reading error:', err);
  });
}
