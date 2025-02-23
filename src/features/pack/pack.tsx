import { ChangeEvent, Fragment, useState } from "react";
import { useParams } from "react-router";

import { useGetPackQuery } from "api/packs";
import {
  type Item as ItemType,
  useCreateItemMutation,
  useLazySearchItemsQuery,
} from "api/items";
import {
  CategoryItem,
  useCreateCategoriesItemMutation,
  useDeleteCategoriesItemMutation,
  useUpdateQuantityMutation,
} from "api/category_item";
import { type Category as CategoryType } from "api/categories";

import { useAuth } from "contexts/Authentication";

import { Category } from "components/Category";
import { Item, Items } from "components/Item";
import { Layout } from "components/Layout/Layout";
import { HeadingOne, TextSansRegular } from "components/Typography";

import { PackWrapper } from "./pack.styled";
import {
  AddItemToPack,
  CreateCategoryModal,
  CreateItemModal,
  OnSubmitItemProps,
} from "./components";

export const Pack = () => {
  const { session } = useAuth();
  let { packId } = useParams();

  // get initial pack data -----------------------------------------------------
  const { data: pack, isLoading, refetch } = useGetPackQuery({ packId });

  // search for items not included in category ---------------------------------
  const [searchItems, { data: items, isLoading: isLoadingItems }] =
    useLazySearchItemsQuery();

  const onSearchItems =
    (category: CategoryType) =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      await searchItems({
        searchString: event.target.value,
        excludeIds: category.categoryItems?.map(({ item }) => item.id),
      });
    };

  // create new item and add to pack -------------------------------------------
  const [createItem] = useCreateItemMutation();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);
  const [query, setTypeQuery] = useState("");

  const onInitiateCreateItem = (category: CategoryType) => {
    return async (type: string) => {
      setSelectedCategory(category);
      setIsCreateItemModalOpen(true);
      setTypeQuery(type);
    };
  };

  const createNewItemAndAddToPack = async ({
    type,
    description,
    weightInGrams,
    quantity,
  }: OnSubmitItemProps) => {
    if (!selectedCategory) return;
    const { data } = await createItem({
      profile_id: session!.user.id,
      type,
      description,
      weight_in_grams: weightInGrams,
    });
    await createCategoriesItem({
      profile_id: session!.user.id,
      item_id: data?.[0].id,
      category_id: selectedCategory?.id,
      quantity,
    });

    setIsCreateItemModalOpen(false);
    setSelectedCategory(null);
    refetch();
  };

  // add existing item to pack -------------------------------------------------
  const [createCategoriesItem] = useCreateCategoriesItemMutation();

  const onSelectItem = (category: CategoryType) => async (item: ItemType) => {
    await createCategoriesItem({
      profile_id: session!.user.id,
      item_id: item.id,
      category_id: category.id,
      quantity: 1,
    });

    refetch();
  };

  // remove item from pack -----------------------------------------------------
  const [deleteCategoriesItem] = useDeleteCategoriesItemMutation();

  const removeItem = async (id: number) => {
    await deleteCategoriesItem(id);
    refetch();
  };

  // update item quantity ------------------------------------------------------
  const [updateQuantity] = useUpdateQuantityMutation();

  const updateItemQuantity = async (
    categoryItemId: number,
    quantity: number,
  ) => {
    await updateQuantity({ categoryItemId, quantity });
    refetch();
  };

  if (isLoading) {
    return "loading...";
  }

  return (
    <Layout>
      <PackWrapper>
        <div>
          <HeadingOne as="h1">{pack?.name}</HeadingOne>
          <TextSansRegular>Lorem ipsum</TextSansRegular>

          {pack?.categories.map((category, i) => (
            <Fragment key={category.id || `category_${i}`}>
              <Category
                key={category.id || `category_${i}`}
                categoryName={category.name}
                color={category.color}
                quantity={category.totalQuantity}
                weight={category.totalWeight}
                weightUnit="g"
              />
              <Items>
                {category.categoryItems.map((categoryItem) => (
                  <Item
                    key={categoryItem.id}
                    categoryItem={categoryItem as CategoryItem}
                    removeFromPack={removeItem}
                    updateItemQuantity={updateItemQuantity}
                  />
                ))}
                <AddItemToPack
                  onSearch={onSearchItems(category)}
                  onSelect={onSelectItem(category)}
                  onInitiateCreate={onInitiateCreateItem(category)}
                  results={items ?? []}
                />
              </Items>
            </Fragment>
          ))}

          {/* modals ------------------------------------------------------- */}
          {selectedCategory && (
            <CreateItemModal
              isOpen={isCreateItemModalOpen}
              initialType={query}
              onClose={() => setIsCreateItemModalOpen(false)}
              onSubmit={createNewItemAndAddToPack}
            />
          )}
          <CreateCategoryModal packId={packId} refetch={refetch} />
        </div>
      </PackWrapper>
    </Layout>
  );
};
