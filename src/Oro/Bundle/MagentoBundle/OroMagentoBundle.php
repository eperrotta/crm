<?php

namespace Oro\Bundle\MagentoBundle;

use Oro\Bundle\MagentoBundle\Async\Topics;
use Oro\Bundle\MessageQueueBundle\DependencyInjection\Compiler\AddTopicMetaPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class OroMagentoBundle extends Bundle
{
    /**
     * {@inheritdoc}
     */
    public function build(ContainerBuilder $container)
    {
        $addTopicPass = AddTopicMetaPass::create()
            ->add(Topics::SYNC_CART_EXPIRATION_INTEGRATION)
            ->add(Topics::SYNC_INITIAL_INTEGRATION)
        ;
        $container->addCompilerPass($addTopicPass);
    }
}
