export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  author: string;
  image: string;
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "first-time-renter-checklist-malaysia",
    title: "First-time renter checklist for Malaysia",
    excerpt:
      "Documents, deposits, viewing tips, and red flags every first-time tenant should know before signing.",
    content: [
      "Renting your first home in Malaysia can feel overwhelming — from understanding deposits to reading tenancy terms. Start by confirming your budget, including rent, utilities, and a typical two-month deposit.",
      "Always visit the property in person (or via a trusted video tour). Check water pressure, electrical points, mould, and neighbourhood access to transit and groceries.",
      "On RentNest, send a clear rental request with your preferred move-in date and a short introduction. Landlords respond faster when your message is specific and professional.",
      "After approval, complete payment through Stripe Checkout so both sides have a transparent record. Keep screenshots of your agreement and payment confirmation.",
    ],
    category: "Guides",
    date: "Mar 12, 2026",
    author: "Kazi Ashik",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
  },
  {
    slug: "landlord-guide-approving-tenants",
    title: "How landlords can approve the right tenants faster",
    excerpt:
      "A practical workflow for reviewing requests, communicating availability, and reducing vacant days.",
    content: [
      "Empty units cost money. The fastest landlords on RentNest keep listings updated — accurate photos, fair pricing, and a clear availability status.",
      "When a request arrives, review the move-in date and message carefully. Reply within 24 hours even if you need more information — silence loses good tenants.",
      "Approve only when you are ready to proceed to payment. Rejected requests should include a polite reason so tenants can adjust and reapply elsewhere.",
      "Use the landlord dashboard to track pending requests and active tenancies. Consistent process beats ad-hoc chat threads every time.",
    ],
    category: "Landlords",
    date: "Feb 28, 2026",
    author: "RentNest Team",
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
  },
  {
    slug: "why-secure-rent-payments-matter",
    title: "Why secure rent payments matter for both sides",
    excerpt:
      "Cash handovers create disputes. Digital checkout creates a paper trail and clearer expectations.",
    content: [
      "Cash and informal transfers leave both tenants and landlords exposed. Disputes about ‘I already paid’ are common when there is no shared record.",
      "RentNest uses Stripe Checkout for approved rentals. Tenants complete payment on Stripe’s hosted page; landlords see status updates once the webhook confirms success.",
      "This protects tenants from paying before approval and helps landlords confirm funds before handing over keys.",
      "Pair secure payment with clear communication on move-in logistics — keys, inventory list, and utility transfer — for a smoother start.",
    ],
    category: "Payments",
    date: "Feb 10, 2026",
    author: "RentNest Team",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    readTime: "3 min read",
  },
  {
    slug: "penang-rental-neighbourhoods-2026",
    title: "Penang neighbourhoods worth considering in 2026",
    excerpt:
      "From George Town walkability to Relau value — a quick orientation for newcomers and relocators.",
    content: [
      "George Town suits professionals who want cafés, coworking, and heritage streets within walking distance — expect higher rents for well-renovated units.",
      "Bayan Lepas and Relau often offer better value for space, especially for families working near industrial and tech corridors.",
      "Tanjung Tokong and surrounding coastal areas remain popular for sea views and quieter evenings — check traffic patterns for your commute.",
      "Use RentNest filters for location and price range, then shortlist 3–5 options before scheduling viewings in the same afternoon.",
    ],
    category: "Market",
    date: "Jan 22, 2026",
    author: "Kazi Ashik",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
