import dynamic from 'next/dynamic';

const ItemCategories = dynamic(() => import('@/components/admin/items/ItemCategories'), {
  loading: () => <p>Loading...</p>, // Optional: A fallback component to show while loading
});

function ItemCategoriesPage() {
  return (
    <div className="">
        <ItemCategories />
    </div>
  )
}

export default ItemCategoriesPage