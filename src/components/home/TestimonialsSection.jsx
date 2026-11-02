import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Eleanor Vance",
      role: "Creative Director",
      company: "Vance Atelier Studios, San Francisco",
      country: "United States",
      rating: 5,
      comment: "We source our turquoise nuggets and lead-free pewter charms exclusively from BeadsSource. The consistency of hole drillings and matrix quality is unrivaled at this price tier. Ramesh Sir's team dispatches within 48 hours without fail.",
      verified: true
    },
    {
      name: "Marcus Dupont",
      role: "Founder & Head Jeweler",
      company: "Dupont Joaillerie, Lyon",
      country: "France",
      rating: 5,
      comment: "The perfume bottle gemstone pendants are our top holiday seller. Optical clarity on the crystals and airtight gold screw caps. Custom bulk quotation turnaround was less than 24 hours.",
      verified: true
    },
    {
      name: "Pooja Hegde",
      role: "Boutique Owner",
      company: "Aura Artisan Gems, Bengaluru",
      country: "India",
      rating: 5,
      comment: "Having visited their SP Road showroom personally, I can vouch for the sheer depth of their inventory. The micro-pave CZ toggle clasps and spacer beads never tarnish. True wholesale partner.",
      verified: true
    }
  ];

  return (
    <section className="py-20 bg-[#FAF9F5] border-b border-[#ECE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#B38F26]">
            <Quote className="w-4 h-4 text-[#C4A052]" />
            <span>Verified Wholesale Client Reviews</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Trusted by 5,000+ Jewelry Designers Worldwide
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6759]">
            Read how international studios, wholesale distributors, and boutique chains build profitable collections with BeadsSource.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-[#EAE4D5] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs text-[#4A453A] leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-6 border-t border-[#F2ECE1] mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#7A7366]">{item.role} &bull; {item.company}</p>
                    <p className="text-[10px] text-gray-400">{item.country}</p>
                  </div>
                  {item.verified && (
                    <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-medium shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
