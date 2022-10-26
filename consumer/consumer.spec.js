const { test, expect } = require("@playwright/test");
const { MatchersV3 } = require("@pact-foundation/pact");
const { eachLike } = MatchersV3;
const { Order } = require("./order");
const { provider } = require("../pact");

test.describe("Pact with Order API", () => {
  test.describe("given there are orders", () => {
    const itemProperties = {
      name: "burger",
      quantity: 2,
      value: 100,
    };

    const orderProperties = {
      id: 1,
      items: eachLike(itemProperties),
    };

    test.describe("when a call to the API is made", () => {
      test.beforeEach(() => {
        // Arrange
        provider.addInteraction({
          state: "there are orders",
          uponReceiving: "a request for orders",
          withRequest: {
            path: "/order",
            method: "GET",
          },
          willRespondWith: {
            body: eachLike(orderProperties),
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          },
        });
      });
      test("the list of current orders is returned", async ({ request }) => {
        return provider.executeTest(async (mockserver) => {
          // Act
          console.log(mockserver);
          const response = await request.get(`${mockserver.url}/order`);

          //Assert
          expect(response.ok()).toBeTruthy();
          const order = await response.json();
          console.log(order);
          const responseOrder = new Order(order[0].id, order[0].items);
          const expectedResponseOrder = new Order(orderProperties.id, [
            itemProperties,
          ]);
          expect(responseOrder).toMatchObject(expectedResponseOrder);
          expect(responseOrder.toString()).toMatch(
            expectedResponseOrder.toString()
          );
        });
      });
    });
  });
});
