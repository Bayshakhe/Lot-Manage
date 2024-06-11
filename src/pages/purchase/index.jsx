import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { unitDropdown } from "./utils/dropdownData";
import { FaRegEdit } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LotManageModal from "./LotManageModal";

const purchaseDefaultValue = {
  productName: "Rice 100 mg",
  discount: 100,
  tax: 100,
  subTotal: 100,
  quantity: [
    {
      id: "6639b84f5b8e534fa8da6d40",
      price: "45",
      qty: "2",
    },
    {
      id: "6639b84f5b8e534fa8da6d40",
      price: "1000",
      qty: "4",
    },
  ],
  lot: {
    lotId1: {
      unitId1: 1,
      unitId2: 2,
    },
    lotId2: {
      unitId1: 5,
      unitId2: 3,
    },
  },
  selectedUnits: ["6639b84f5b8e534fa8da6d40", "6639b8485b8e534fa8da6d3c"],
};

const PurchasePage = () => {
  const [modal, setModal] = useState(false);

  const schemaResolver = yup.object().shape({});

  const methods = useForm({
    defaultValues: purchaseDefaultValue,
    resolver: yupResolver(schemaResolver),
  });
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = methods;

  const toggle = () => {
    setModal(!modal);
  };

  const handleUnitSelect = (target, unit, index) => {};

  const onSubmit = () => {
    console.log(watch());
  };

  const selectedUnits = watch("selectedUnits");

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Table className="w-75 mx-auto mt-5 table-bordered">
          <thead className="text-center">
            <tr>
              <th>Produtct</th>
              <th style={{ minWidth: "200px" }}>Unit</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Controller
                  name="productName"
                  control={control}
                  render={(field) => (
                    <input
                      {...register("productName")}
                      {...field}
                      label="productName"
                      className="form-control"
                    />
                  )}
                />
                {errors?.productName && (
                  <p className="text-danger">{errors?.productName.message}</p>
                )}
              </td>
              <td>
                {unitDropdown.map((unit, index) => (
                  <div key={unit.value}>
                    <Controller
                      control={control}
                      {...register(`selectedUnits[${index}]`)}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            id={unit.value}
                            type="checkbox"
                            className="form-check-input"
                            checked={field.value || false}
                            onChange={(e) =>
                              field.onChange(e.target.checked ? unit.value : "")
                            }
                          />
                          <label
                            className="form-check-label ms-2"
                            htmlFor={unit.value}
                          >
                            {unit.label}
                          </label>
                        </>
                      )}
                    />
                  </div>
                ))}

                {errors.units && (
                  <p className="text-danger">{errors.units.message}</p>
                )}
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Discount"
                  {...register("discount")}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Tax"
                  {...register("tax")}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Sub Total"
                  disabled
                  value={0}
                  {...register("subTotal")}
                />
              </td>
              <td className="text-center">
                <FaRegEdit className="text-primary" onClick={toggle} />
              </td>
            </tr>
            {watch("quantity")?.map((unit, index) => (
              <tr key={unit.value}>
                <td colSpan={3}></td>
                <td>
                  <div className="d-flex gap-1 align-items-baseline">
                    <p>Qty</p>
                    <Controller
                      name={`quantity[${index}].qty`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="form-control"
                          label="Quantity"
                          type="number"
                        />
                      )}
                    />
                  </div>
                  {errors?.quantity && errors?.quantity[index]?.qty && (
                    <p className="text-danger">
                      {errors?.quantity[index].qty.message}
                    </p>
                  )}
                </td>
                <td colSpan={2}>
                  <div className="d-flex gap-1 align-items-baseline">
                    <p>Price</p>
                    <Controller
                      name={`quantity[${index}].price`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="form-control"
                          label="Price"
                          type="number"
                        />
                      )}
                    />
                  </div>
                  {errors?.quantity && errors?.quantity[index]?.price && (
                    <p className="text-danger">
                      {errors?.quantity[index].price.message}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-center">
          <Button className="" type="submit">
            Submit
          </Button>
        </div>
      </Form>
      <LotManageModal
        modal={modal}
        setModal={setModal}
        toggle={toggle}
        units={watch("units")}
        data={watch()}
      />
    </FormProvider>
  );
};

export default PurchasePage;
