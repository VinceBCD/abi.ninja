describe("Contract Interaction", () => {
  it("should load EvidenZIssuers on Gnosis via preset selector", () => {
    cy.visit("http://localhost:3000");
    cy.selectPreset("EvidenZIssuers — Gnosis");
    cy.get("button").contains("Load contract").should("not.be.disabled").click();
    cy.url({ timeout: 20000 }).should("include", "/0x09016EF58B53510B40835e1F4938EE74bB167e05/100");
    cy.get(".loading-spinner", { timeout: 20000 }).should("not.exist");
  });

  it("should load EvidenZStorage on BSC via preset selector", () => {
    cy.visit("http://localhost:3000");
    cy.selectPreset("EvidenZStorage — BSC");
    cy.get("button").contains("Load contract").should("not.be.disabled").click();
    cy.url({ timeout: 20000 }).should("include", "/0x2E13439BACF550B0753699f6811405c0100C7F28/56");
    cy.get(".loading-spinner", { timeout: 20000 }).should("not.exist");
  });

  it("should load EvidenZStorage on Gnosis via preset selector", () => {
    cy.visit("http://localhost:3000");
    cy.selectPreset("EvidenZStorage — Gnosis");
    cy.get("button").contains("Load contract").should("not.be.disabled").click();
    cy.url({ timeout: 20000 }).should("include", "/0x2e9e949f19d068b8f6be46136e496f7cdbf5f4ba/100");
    cy.get(".loading-spinner", { timeout: 20000 }).should("not.exist");
  });

  it("should load EvidenZStorage on Avalanche via preset selector", () => {
    cy.visit("http://localhost:3000");
    cy.selectPreset("EvidenZStorage — Avalanche");
    cy.get("button").contains("Load contract").should("not.be.disabled").click();
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
