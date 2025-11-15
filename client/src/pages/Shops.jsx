import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShops } from '../slices/advisorSlice.js';

const Shops = () => {
  const dispatch = useDispatch();
  const { shops } = useSelector((state) => state.advisors);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="uppercase text-xs tracking-[0.3em] text-white/70">Healthy food shops</p>
            <h1 className="text-4xl font-semibold mt-3">Discover healthy grocers in Sri Lanka</h1>
            <p className="mt-4 text-white/80">
              Find organic markets, traditional food stores, and specialty shops offering authentic
              Sri Lankan healthy foods and ingredients.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                Organic produce
              </span>
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                Traditional ingredients
              </span>
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                Healthy snacks
              </span>
            </div>
          </div>
          {/* Decorative mood grid removed to keep hero clean */}
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Featured healthy food shops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <a
              key={shop._id}
              href={shop.websiteUrl || shop.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-slate-100 rounded-2xl p-0 hover:border-brand-primary hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={
                    shop.image && shop.image.length
                      ? shop.image
                      : `https://source.unsplash.com/featured/500x300/?${encodeURIComponent(
                          `${shop.city} organic market`
                        )}`
                  }
                  alt={shop.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <p className="font-semibold text-slate-800 text-lg mb-1">{shop.name}</p>
                <p className="text-slate-500 mb-3">{shop.city}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {shop.specialties?.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-700 font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-primary font-semibold">Visit website →</span>
                  {shop.mapUrl && (
                    <a
                      href={shop.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-500 hover:text-brand-primary"
                    >
                      View on map
                    </a>
                  )}
                </div>
              </div>
            </a>
          ))}
          {!shops.length && (
            <p className="text-slate-500 text-sm col-span-full">No shops available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shops;

