describe("Contract Interaction", () => {
  it("should load DAI contract on Ethereum and interact with its balanceOf method", () => {
    cy.visit("http://localhost:3000");
    cy.selectNetwork("Ethereum");
    cy.loadContract("0x6B175474E89094C44Da98b954EedeAC495271d0F");
    cy.url({ timeout: 20000 }).should("include", "/0x6B175474E89094C44Da98b954EedeAC495271d0F/1");
    cy.get(".loading-spinner", { timeout: 20000 }).should("not.exist");
    cy.interactWithMethod("balanceOf", "0x6B175474E89094C44Da98b954EedeAC495271d0F");
  });

  it("should load a contract on BNB Smart Chain and interact with its balanceOf method", () => {
    cy.visit("http://localhost:3000");
    cy.selectNetwork("BNB Smart Chain");
    cy.loadContract("0x2170ed0880ac9a755fd29b2688956bd959f933f8");
    cy.url({ timeout: 20000 }).should("include", "/0x2170ed0880ac9a755fd29b2688956bd959f933f8/56");
    cy.get(".loading-spinner", { timeout: 20000 }).should("not.exist");
    cy.interactWithMethod("balanceOf", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });

  it("should load EvidenZStorage on Gnosis and interact with a read method", () => {
    cy.visit("http://localhost:3000");
    cy.loadContract("0x2e9e949f19d068b8f6be46136e496f7cdbf5f4ba");
    cy.url({ timeout: 20000 }).should("include", "/0x2e9e949f19d068b8f6be46136e496f7cdbf5f4ba/100");
    cy.get(".loading-spinner", { timeout: 20000 }).should("not.exist");
  });

  it("should load a contract on Avalanche and interact with its balanceOf method", () => {
    cy.visit("http://localhost:3000");
    cy.selectNetwork("Avalanche");
    cy.loadContract("0x5bC445bbB32f75B9b09B68413d2042D3b87bEf8A");
    cy.url({ timeout: 20000 }).should("include", "/0x5bC445bbB32f75B9b09B68413d2042D3b87bEf8A/43114");
    cy.get(".loading-spinner", { timeout: 20000 }).should("not.exist");
  });

  it("should add Viction as a custom chain and interact with a contract by submitting an ABI manually", () => {
    cy.visit("http://localhost:3000");
    cy.selectNetwork("Add custom chain");
    cy.get("#add-custom-chain-modal").should("be.visible");
    cy.addCustomChain({
      id: "88",
      name: "Viction",
      nativeCurrencyName: "VIC",
      nativeCurrencySymbol: "VIC",
      nativeCurrencyDecimals: "18",
      rpcUrl: "https://rpc.viction.xyz",
      blockExplorer: "https://tomoscan.io/",
    });
    cy.get("#react-select-container").should("contain", "Viction");
    cy.get('input[placeholder="Contract address"]').type("0x381B31409e4D220919B2cFF012ED94d70135A59e");
    cy.fixture("viction_abi").then(victionABI => {
      cy.importABI(JSON.stringify(victionABI));
    });
    cy.url().should("include", "/0x381B31409e4D220919B2cFF012ED94d70135A59e/88");
    cy.get(".loading-spinner", { timeout: 10000 }).should("not.exist");
    cy.interactWithMethod("balanceOf", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });
});
