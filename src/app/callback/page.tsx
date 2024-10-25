import { Suspense } from 'react';
import CallbackPage from './callback_page';

export default function Callback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackPage />
    </Suspense>
  );
}