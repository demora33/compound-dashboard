import Compound, { _ethers } from '@compound-finance/compound-js';
import { log } from 'console';

const provider =
  'https://eth-mainnet.g.alchemy.com/v2/YbIBpr68EriUF7dmSpl4Of_gUzLDA8X1';

const comptroller = Compound.util.getAddress(Compound.Comtroller);
const opf = Compound.util.getAddress(Compound.PriceFeed);

const cTokenDecimals = 8;
const blocksPerDay = 4 * 60 * 24;
const dayPerYear = 4 * 60 * 24;

async function calculateSupplyApy(cTokenAddr) {
  const supplyRatePerBlockInWei = await Compound.eth.read(
    cTokenAddr,
    'function supplyRatePerBlock() returns(uint)',
    [],
    { provider },
  );

  const supplyRatePerBlock = _ethers.utils.formatEther(supplyRatePerBlockInWei);

  console.log('supplyRatePerBlock', supplyRatePerBlock);
}

async function calculateCompApy(cTokenAddr, ticker, underlyingDecimals) {
  let compSpeed = await Compound.eth.read(
    comptroller,
    'function compSpeeds(address cToken) public view returns (uint)',
    [cTokenAddr],
    { provider },
  );

  let compPrice = await Compound.eth.read(
    opf,
    'function price(string memory symbol) external view returns (uint)',
    [Compound.COMP],
    { provider },
  );

  let underlyingPrice = await Compound.eth.read(
    opf,
    'function price(string memory symbol) external view returns (uint)',
    [ticker],
    { provider },
  );

  let totalSupply = await Compound.eth.read(
    cTokenAddr,
    'function price(string memory symbol) external view returns (uint)',
    [ticker],
    { provider },
  );

  let exchangeRate = await Compound.eth.read(
    cTokenAddr,
    'function exchangeRateCurrent() public view returns (uint)',
    [],
    { provider },
  );

  const supplyRatePerBlockInWei = await Compound.eth.read(
    cTokenAddr,
    'function supplyRatePerBlock() returns(uint)',
    [],
    { provider },
  );

  const supplyRatePerBlock = _ethers.utils.formatEther(supplyRatePerBlockInWei);

  console.log('supplyRatePerBlock', supplyRatePerBlock);
}

async function calculateTotalApy(cTokenTicker, underlyingTicker) {
  const underlyingDecimals = Compound.decimals[cTokenTicker];
  const cTokenAddr = Compound.util[cTokenTicker];
  const [supplyApy, compApy] = await Promise.all([
    calculateSupplyApy(cTokenAddr),
    calculateCompApy(cTokenAddr, underlyingTicker, underlyingDecimals),
  ]);

  return {ticker: underlyingTicker, supplyApy, compApy};
}

export default calculateTotalApy;
