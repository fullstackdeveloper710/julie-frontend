import { Input, Button } from '@/components/ui';
import { useState } from 'react';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    return (
        <section className="bg-linear-to-b from-slate-800 to-slate-900 border-t border-slate-800 py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-bold text-2xl text-white mb-2">
                    Not Ready to Subscribe Yet?
                </h2>
                <p className="text-sm mb-6">
                    Leave your name and email and we'll send you a platform overview and sample intelligence report.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        placeholder="Your Name"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        containerClassName="flex-1"
                        inputClassName="px-4 py-3 bg-slate-700/40 border border-slate-600 rounded text-white placeholder-slate-500 text-sm"
                    />
                    <Input
                        placeholder="Your Email"
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        containerClassName="flex-1"
                        inputClassName="px-4 py-3 bg-slate-700/40 border border-slate-600 rounded text-white placeholder-slate-500 text-sm"
                    />
                    <Button buttonClassName="font-bold text-sm tracking-wider uppercase px-8 py-3 rounded bg-(--accent) text-slate-950 hover:bg-orange-600 transition-colors whitespace-nowrap">
                        Send Me Info
                    </Button>
                </div>
            </div>
        </section>
    );
}
