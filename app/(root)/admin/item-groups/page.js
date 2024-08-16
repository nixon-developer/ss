import dynamic from 'next/dynamic';

const ItemGroups = dynamic(() => import('@/components/admin/items/ItemGroups'), {
  loading: () => <p>Loading...</p>, // Optional: A fallback component to show while loading
});

function ItemGroupsPage() {
  return (
    <div className="">
        <ItemGroups />
    </div>
  )
}

export default ItemGroupsPage