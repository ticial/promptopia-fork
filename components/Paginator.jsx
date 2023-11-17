const setNums = (current, last, sideNums = 1) => {
  const fullSize = sideNums * 2;
  const nums = [];
  const min = Math.max(0, Math.min(last - fullSize, current - sideNums));
  const max = Math.min(last, Math.max(fullSize, current + sideNums));
  for (let index = min; index <= max; index++) {
    nums.push(index);
  }
  return nums;
};

const PaginatorItem = ({ num, active = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(num)}
      className={active ? "pagi_black_btn" : "pagi_outline_btn"}>
      {num + 1}
    </button>
  );
};

const Paginator = ({ offset, limit, total, changeOffset }) => {
  const current = Math.floor(offset / limit);
  const last = Math.floor((total - 1) / limit);
  const nums = setNums(current, last);

  const changePage = (num) => changeOffset(num * limit);
  return (
    <div className="flex gap-4">
      {nums[0] !== 0 && <PaginatorItem num={0} onClick={changePage} />}
      {nums[0] === 2 && <PaginatorItem num={1} onClick={changePage} />}
      {nums[0] > 2 && <div className="pagi_dots">...</div>}
      {nums.map((num) => (
        <PaginatorItem
          key={num}
          num={num}
          onClick={changePage}
          active={num === current}
        />
      ))}
      {nums[nums.length - 1] < last - 2 && <div className="pagi_dots">...</div>}
      {nums[nums.length - 1] === last - 2 && (
        <PaginatorItem num={last - 1} onClick={changePage} />
      )}
      {nums[nums.length - 1] !== last && (
        <PaginatorItem num={last} onClick={changePage} />
      )}
    </div>
  );
};

export default Paginator;
