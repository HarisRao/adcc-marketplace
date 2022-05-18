import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BigNumberish } from 'ethers'
import { Stake } from 'state/types'
import { handleTransactionCall } from 'utils/callHelpers'
import { toastError } from 'state/toasts'
import { useStakingContract } from './useContract'
import { useActiveWeb3React } from './web3'

const useStaking = () => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const stakingPool = useStakingContract()
  const [stakeLoading, setLoading] = useState(false)
  const [lockIds, setLockIds] = useState<number[]>([])
  const [stakes, setStakes] = useState<Stake[]>([])

  const getStakes = useCallback(async (_account: string) => {
    setLoading(true)

    try {
      const _lockIdsBN = await stakingPool.getUserStaking(_account)
      const _lockIds = _lockIdsBN.map((l) => l.toNumber())
      setLockIds(_lockIds)

      const _stakes: typeof stakes = []
      await Promise.all(
        _lockIds.map(async (lockId, idx) => {
          _stakes[idx] = await stakingPool.tokens_staking(lockId)
        }),
      )

      setStakes(_stakes)
    } catch (error: any) {
      dispatch(toastError('Error loading stakes', error?.message))
    } finally {
      setLoading(false)
    }
  }, [dispatch, stakingPool])

  useEffect(() => {
    if (account) getStakes(account)
  }, [getStakes, account])

  const stake = useCallback(
    async (ammount: BigNumberish, months: number) => {
      if (account && stakingPool) {
        try {
          setLoading(true)
          const success = await handleTransactionCall(() => stakingPool.invest(months, ammount), dispatch)
          if (success) await getStakes(account)
          return success
        } finally {
          setLoading(false)
        }
      }
      return false
    },
    [dispatch, getStakes, account, stakingPool],
  )

  const withdrawAndClaim = useCallback(
    async (lockId: number) => {
      if (account && stakingPool) {
        try {
          setLoading(true)
          const success = await handleTransactionCall(() => stakingPool.withdrawAndClaim(lockId), dispatch)
          if (success) await getStakes(account)
          return success
        } finally {
          setLoading(false)
        }
      }
      return false
    },
    [dispatch, getStakes, account, stakingPool],
  )

  return { stakeLoading, stakeContract: stakingPool?.address, lockIds, stakes, stake, withdrawAndClaim }
}

export default useStaking
