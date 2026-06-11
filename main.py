numbers = input('Enter numbers separated by spaces: ')
nums = list(map(float, numbers.split()))
average = sum(nums) / len(nums)
print('Average:', average)
