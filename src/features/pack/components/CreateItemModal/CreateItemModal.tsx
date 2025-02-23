import { FormEventHandler, useState } from "react";
import { ActionsWrapper, Modal } from "components/Modal";
import { Field } from "components/Field";
import { Input } from "components/Input";
import { Button } from "components/Button";

export type OnSubmitItemProps = {
  type: string;
  description: string;
  weightInGrams: number;
  quantity: number;
};

type CreateItemModalProps = {
  initialType?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: OnSubmitItemProps) => void;
};

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
  initialType,
  isOpen,
  onClose,
  onSubmit,
}: CreateItemModalProps) => {
  // form state
  const [type, setType] = useState(initialType ?? "");
  const [description, setDescription] = useState("");
  const [weightInGrams, setWeightInGrams] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const resetFormState = () => {
    setType("");
    setDescription("");
    setWeightInGrams(0);
    setQuantity(0);
  };

  // submit handler ------------------------------------------------------------
  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await onSubmit({
      type,
      description,
      weightInGrams,
      quantity,
    });
    resetFormState();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleOnSubmit}>
        <Field label="Type">
          <Input
            type="text"
            name="type"
            value={type}
            placeholder="type"
            onChange={(e) => setType(e.target.value)}
          />
        </Field>
        <Field label="Description">
          <Input
            type="text"
            name="description"
            value={description}
            placeholder="description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label="Weight">
          <Input
            type="number"
            name="weight"
            value={weightInGrams}
            placeholder="weight"
            onChange={(e) => setWeightInGrams(+e.target.value)}
          />
        </Field>
        <Field label="Quantity">
          <Input
            type="number"
            name="quantity"
            value={quantity}
            placeholder="quantity"
            onChange={(e) => setQuantity(+e.target.value)}
          />
        </Field>
        <ActionsWrapper>
          <Button variant="secondary" size="large" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" size="large">
            Add Item
          </Button>
        </ActionsWrapper>
      </form>
    </Modal>
  );
};
